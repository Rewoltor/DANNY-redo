import * as React from 'react';
import TestScreenContainer from '../../../components/TestScreenContainer';

export default function PosttestExperimentalTest() {
  return (
    <TestScreenContainer
      phase={'posttest'}
      mode={'noai'}
      poolFolder={'post_experiment'}
      trialsCount={5}
    />
    // NOTE: trialsCount=5 for quicker manual testing; change to 30 for production
  );
}
