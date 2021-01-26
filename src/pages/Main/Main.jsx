import React from 'react';
import Container from '../../components/Container/Container';
import { withRouter } from 'react-router';

function Main({ history }) {
  return (
    <Container>
      <div>
        <p>
          <strong>깨알같은포인트</strong>님<br />
          기다리고 있었어요! (유저 정보 조회 필요)
        </p>
      </div>
    </Container>
  );
}

export default withRouter(Main);
