'use client';

import CertificateBento from './CertificateBento';
import TraceabilityTimeline from './TraceabilityTimeline';
import QualityMetrics from './QualityMetrics';

export default function TraceabilitySection() {
  return (
    <div className="bg-neutral-950 flex flex-col w-full overflow-hidden">
      
      {/* 
        Section 1: The Timeline
        Illustrates the MES processing and full traceability 
      */}
      <TraceabilityTimeline />

      {/* 
        Section 2: The Certificate Bento Grid
        Interactive credential showcase 
      */}
      <CertificateBento />

      {/* 
        Section 3: The Metrics
        Closing the loop with concrete performance data and guarantees 
      */}
      <QualityMetrics />
      
    </div>
  );
}
