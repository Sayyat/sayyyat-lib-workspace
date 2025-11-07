import React from "react";

const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

interface ErrorStateProps {
  title?: string;
  message?: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: 'grey' }}>
      <div style={{ borderRadius: '9999px', backgroundColor: 'grey', padding: '1rem', marginBottom: '1rem' }}>
        <AlertTriangleIcon style={{ width: '3rem', height: '3rem', color: 'red' }} />
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'red' }}>
        {title ?? "An Error Occurred"}
      </h3>
      <p style={{ fontSize: '0.875rem' }}>
        {message ?? "We couldn't load the data due to a server or network issue."}
      </p>
    </div>
  );
}