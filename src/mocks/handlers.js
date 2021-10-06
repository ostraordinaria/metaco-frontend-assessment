import { rest } from 'msw';

export const handlers = [
  rest.get(`${process.env.REACT_APP_API_URL}/leaderboards`, (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        data: [
          {
            id: 1,
            title: 'Metaco Tournament Dota 2 #1',
            startDate: '2021-07-30T17:00:00.000Z',
            endDate: '2021-07-31T17:00:00.000Z',
            teamCount: 10,
            slot: 10,
            teams: [
              { id: 1, name: 'Team #1' },
              { id: 2, name: 'Team #2' },
              { id: 3, name: 'Team #3' },
              { id: 4, name: 'Team #4' },
              { id: 5, name: 'Team #5' },
              { id: 6, name: 'Team #6' },
              { id: 7, name: 'Team #7' },
              { id: 8, name: 'Team #8' },
              { id: 9, name: 'Team #9' },
              { id: 10, name: 'Team #10' },
            ],
            tournamentResults: [
              { teamId: 1, position: 10, point: 0, tournamentId: 1 },
            ],
          },
        ],
      })
    );
  }),

  rest.get(`${process.env.REACT_APP_API_URL}/explorer`, (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        data: [
          {
            coin: 3,
            createdAt: new Date(),
            email: 'test@email.com',
            id: 10,
            name: 'User name',
            picture: '',
            updatedAt: new Date(),
          },
        ],
      })
    );
  }),
];
