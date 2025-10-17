import * as React from 'react';
import TestScreenContainer from '../../../components/TestScreenContainer';

export default function ExperimentExperimentalTest() {
  return (
    <TestScreenContainer
      phase={'experiment'}
      mode={'ai'}
      poolFolder={'experiment'}
      trialsCount={5}
    />
    // NOTE: trialsCount=5 for quicker manual testing; change to 30 for production
  );
}
