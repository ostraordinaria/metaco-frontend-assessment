import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Stack,
  Skeleton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { client } from 'utils/api-client';
import { formatDate } from 'utils/misc';

const LeaderboardTable = () => {
  const [idle, setIdle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  const fetchTournaments = async () => {
    setLoading(true);
    setIdle(false);
    await client('leaderboards')
      .then(({ data }) => {
        setTournaments(data);
        setIdle(true);
      })
      .catch(error => {
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tournaments.length === 0) {
      fetchTournaments();
    }
  }, [tournaments]);

  return (
    <>
      {error ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="tomato"
        >
          Something wrong happened. Please try again.
        </Box>
      ) : (
        <Table variant="striped" colorScheme="blackAlpha">
          <TableCaption>Leaderboard</TableCaption>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Tournament Date</Th>
              <Th>Slot</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              Array(5)
                .fill('')
                .map((_, index) => (
                  <Tr key={index}>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                  </Tr>
                ))
            ) : idle && tournaments.length ? (
              tournaments.map(tournament => (
                <Tr key={tournament.id}>
                  <Td>{tournament.title}</Td>
                  <Td>
                    {`${formatDate(tournament.startDate)} - ${formatDate(
                      tournament.endDate
                    )}`}
                  </Td>
                  <Td>{`${tournament.teamCount}/${tournament.slot}`}</Td>
                  <Td>
                    <Stack direction={['column', 'row']}>
                      <Box>
                        <ManageWinner
                          endDate={tournament.endDate}
                          teams={tournament.teams}
                          tournamentResults={tournament.tournamentResults}
                        />
                      </Box>
                      <Box>
                        <ShowStandings
                          teams={tournament.teams}
                          tournamentResults={tournament.tournamentResults}
                        />
                      </Box>
                    </Stack>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  No Data
                </Td>
              </Tr>
            )}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Title</Th>
              <Th>Tournament Date</Th>
              <Th>Slot</Th>
              <Th>Action</Th>
            </Tr>
          </Tfoot>
        </Table>
      )}
    </>
  );
};

const ManageWinner = ({ teams, endDate, tournamentResults }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getWinnerStandings = () => {
    let winnerStandings = Array(teams.length);
    if (!tournamentResults.length) return winnerStandings;
    for (const tournamentResult of tournamentResults) {
      winnerStandings[tournamentResult.position - 1] = tournamentResult.teamId;
    }
    return winnerStandings;
  };

  const [winners, setWinners] = useState(() => getWinnerStandings());

  const disableManage = endDate => {
    const d1 = new Date(new Date().setHours(0, 0, 0, 0));
    const d2 = new Date(new Date(endDate).setHours(0, 0, 0, 0));
    return d1 <= d2;
  };

  const handleClose = () => {
    onClose();
    setWinners(getWinnerStandings());
  };

  return (
    <>
      <Button
        colorScheme="cyan"
        size="xs"
        color="white"
        onClick={onOpen}
        disabled={disableManage(new Date(endDate)) || teams.length === 0}
      >
        Manage Winner
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Winner </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {Array(teams.length)
              .fill('')
              .map((_, index) => (
                <FormControl my={3} key={index}>
                  <FormLabel>{`Position ${index + 1}`}</FormLabel>
                  <Select
                    disabled={tournamentResults.some(
                      ({ position }) => position === index + 1
                    )}
                    placeholder="Select option"
                    variant="outline"
                    onChange={event => {
                      const value = Number(event.target.value);
                      const updatedWinners = [...winners];
                      updatedWinners[index] = value;
                      setWinners(updatedWinners);
                    }}
                  >
                    {teams.map(({ id, name }) => (
                      <option
                        value={id}
                        disabled={winners.includes(id)}
                        selected={tournamentResults.some(
                          ({ teamId, position }) =>
                            teamId === id && position === index + 1
                        )}
                      >
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button variant="ghost">Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const ShowStandings = ({ tournamentResults, teams }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        colorScheme="cyan"
        size="xs"
        color="white"
        onClick={onOpen}
        disabled={!tournamentResults.length}
      >
        Show Standings
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Current Standings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={['row', 'column']}>
              {teams.map((team, index) => (
                <FormControl my={3} key={index}>
                  <FormLabel>{`Position ${index + 1}`}</FormLabel>
                  <Text>
                    {tournamentResults.find(
                      ({ position }) => position === index + 1
                    )
                      ? team.name
                      : '-'}
                  </Text>
                </FormControl>
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LeaderboardTable;
