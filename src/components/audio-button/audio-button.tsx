import { useEffect, useRef, useState, type FC } from "react";
import styles from "./audio-button.module.css";

interface Props {
  audioUrl: string;
}

export const AudioButton: FC<Props> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(audioUrl);

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const onClick = (): void => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <button className={styles.audioButton} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="45"
        height="45"
        fill="none"
        viewBox="0 0 45 45"
      >
        <mask
          id="mask0_103_1238"
          width="45"
          height="45"
          x="0"
          y="0"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "luminance" }}
        >
          <path
            fill="#fff"
            stroke="#fff"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M22.5 44C34.374 44 44 34.374 44 22.5S34.374 1 22.5 1 1 10.626 1 22.5 10.626 44 22.5 44Z"
          ></path>
          <path
            fill="#000"
            d="M14.975 24.543a2.15 2.15 0 1 0 0-4.3 2.15 2.15 0 0 0 0 4.3"
          ></path>
          <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.297 27.714a7.5 7.5 0 0 0 2.204-5.321 7.5 7.5 0 0 0-2.204-5.322m5.321 15.963a15 15 0 0 0 4.408-10.643c0-4.155-1.685-7.918-4.408-10.641"
          ></path>
        </mask>
        <g mask="url(#mask0_103_1238)">
          <path fill="#20487F" d="M-3.3-3.3h51.6v51.6H-3.3z"></path>
        </g>
      </svg>
    </button>
  );
};
