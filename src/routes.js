import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress} from 'apollo-server-express';

const router = express.Router();
import schema from './data/schema.js';
router.use('/graphql', bodyParser.json(), (req, res, next) =>
  graphqlExpress({
    schema,
    context: { user: req.user }
  })(req, res, next)
)
router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

export default router;
