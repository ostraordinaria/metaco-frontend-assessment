import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Skeleton,
} from '@chakra-ui/react';
import { client } from 'utils/api-client';

const ExplorerTable = () => {
  const [idle, setIdle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    setIdle(false);
    await client('explorer')
      .then(({ data }) => {
        setUsers(data);
        setIdle(true);
      })
      .catch(error => {
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users]);

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
          <TableCaption>Explorer</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Coin</Th>
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
                  </Tr>
                ))
            ) : idle && users.length ? (
              users.map(user => (
                <Tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.coin}</Td>
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
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Coin</Th>
            </Tr>
          </Tfoot>
        </Table>
      )}
    </>
  );
};

export default ExplorerTable;
