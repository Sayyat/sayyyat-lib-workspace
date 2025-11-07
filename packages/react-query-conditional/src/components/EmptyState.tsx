import React from "react";

const PackageOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v4" />
    <path d="M16 4.5v1" />
    <path d="M8 4.5v1" />
    <path d="M21 8.5v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-10" />
    <path d="m21 8-3-5.2A2 2 0 0 0 16.2 2H7.8a2 2 0 0 0-1.7 1.3L3 8" />
    <path d="M3.5 8.5h17" />
  </svg>
);

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'grey' }}>
      <div style={{ borderRadius: '9999px', backgroundColor: 'grey', padding: '1rem', marginBottom: '1rem' }}>
        <PackageOpenIcon style={{ width: '3rem', height: '3rem', color: 'yellow' }} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'yellow' }}>
        {title ?? "No Data Found"}
      </h3>
      <p style={{ fontSize: '0.875rem' }}>
        {message ?? "There's nothing to show here yet."}
      </p>
    </div>
  );
}