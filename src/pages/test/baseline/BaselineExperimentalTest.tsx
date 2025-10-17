import * as React from 'react';
import TestScreenContainer from '../../../components/TestScreenContainer';

export default function BaselineExperimentalTest() {
  return (
    <TestScreenContainer phase={'baseline'} mode={'ai'} poolFolder={'baseline'} trialsCount={5} />
    // NOTE: trialsCount=5 for quicker manual testing; change to 30 for production
  );
}
