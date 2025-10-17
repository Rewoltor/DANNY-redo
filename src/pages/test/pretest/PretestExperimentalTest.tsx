import * as React from 'react';
import TestScreenContainer from '../../../components/TestScreenContainer';

export default function PretestExperimentalTest() {
  return (
    <TestScreenContainer phase={'pretest'} mode={'ai'} poolFolder={'screening'} trialsCount={5} />
    // NOTE: trialsCount=5 for quicker manual testing; change to 10 for production
  );
}
