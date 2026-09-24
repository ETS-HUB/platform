import React from "react";

interface CertificateSvgProps {
  recipientName?: string;
  courseName?: string;
  instructorName?: string;
}

const CertificateSvg = ({
  recipientName = "John Doe",
  courseName = "JavaScript Fundamentals",
  instructorName = "John Niyon",
}: CertificateSvgProps) => {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-auto" aria-hidden>
      {/* base */}
      <rect width="600" height="400" fill="#FFFFFF" />

      {/* outer + inner rule border, formal double-line frame */}
      <rect
        x="14"
        y="14"
        width="572"
        height="372"
        fill="none"
        stroke="#3A0CA3"
        strokeWidth="2"
      />
      <rect
        x="22"
        y="22"
        width="556"
        height="356"
        fill="none"
        stroke="#DDC9F0"
        strokeWidth="1"
      />

      {/* corner marks */}
      {[
        { x: 14, y: 14, rot: 0 },
        { x: 586, y: 14, rot: 90 },
        { x: 586, y: 386, rot: 180 },
        { x: 14, y: 386, rot: 270 },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}>
          <path d="M0 0 L22 0" stroke="#3A0CA3" strokeWidth="3" />
          <path d="M0 0 L0 22" stroke="#3A0CA3" strokeWidth="3" />
        </g>
      ))}

      {/* faint watermark seal, background */}
      <circle cx="300" cy="205" r="120" fill="#F5EEFE" opacity="0.5" />

      <image
        href="/logo.png"
        x="230"
        y="10"
        width="140"
        height="100"
        preserveAspectRatio="xMidYMid meet"
      />

      {/* title */}
      <text
        x="300"
        y="142"
        textAnchor="middle"
        fontFamily="Lora, serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="1.5"
        fill="#0e1430"
      >
        CERTIFICATE OF COMPLETION
      </text>
      <rect x="255" y="154" width="90" height="2" fill="#FFE866" />

      {/* body copy */}
      <text x="300" y="188" textAnchor="middle" fontSize="12.5" fill="#6B7280">
        This certifies that
      </text>

      {/* recipient name */}
      <text
        x="300"
        y="226"
        textAnchor="middle"
        fontFamily="Lora, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="32"
        fill="#3A0CA3"
      >
        {recipientName}
      </text>
      <path d="M180 238 L420 238" stroke="#DDC9F0" strokeWidth="1" />

      <text x="300" y="264" textAnchor="middle" fontSize="12.5" fill="#6B7280">
        has successfully completed the course
      </text>
      <text
        x="300"
        y="288"
        textAnchor="middle"
        fontWeight="700"
        fontSize="16"
        fill="#0e1430"
      >
        {courseName}
      </text>

      <g>
        <path d="M90 336 L220 336" stroke="#0e1430" strokeWidth="1" />
        <text
          x="155"
          y="352"
          textAnchor="middle"
          fontWeight="600"
          fontSize="11"
          fill="#0e1430"
        >
          {instructorName}
        </text>
        <text x="155" y="365" textAnchor="middle" fontSize="9" fill="#8B84A0">
          Instructor
        </text>
      </g>

      <g>
        <path d="M380 336 L510 336" stroke="#0e1430" strokeWidth="1" />
        <text
          x="445"
          y="352"
          textAnchor="middle"
          fontWeight="600"
          fontSize="11"
          fill="#0e1430"
        >
          Timothy Onyeacholam
        </text>
        <text x="445" y="365" textAnchor="middle" fontSize="9" fill="#8B84A0">
          Executive Director, ETS Academy
        </text>
      </g>

      <g transform="translate(540 318)">
        <circle r="26" fill="#FFE866" stroke="#FFFFFF" strokeWidth="2" />
        <circle r="19" fill="#3A0CA3" />
        <path
          d="M0 -9c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.4"
        />
        <path
          d="M-4 0 l3 3 5-6"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M-9 22l-6 13 8-2 4.5 7 5.5-12" fill="#7408B3" />
        <path d="M9 22l6 13-8-2-4.5 7-5.5-12" fill="#5A0790" />
      </g>
    </svg>
  );
};

export default CertificateSvg;
