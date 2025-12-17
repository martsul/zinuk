import { useEffect, useRef, useState, type FC } from "react";
import styles from "./audio-button.module.css";
import classNames from "classnames";

interface Props {
  audioUrl: string;
  ltr?: boolean;
}

const audioInstances: {
  audio: HTMLAudioElement;
  stop: () => void;
}[] = [];

export const AudioButton: FC<Props> = ({ audioUrl, ltr }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const instance = {
      audio,
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false); 
      },
    };

    audioInstances.push(instance);

    audio.addEventListener("ended", instance.stop);

    return () => {
      instance.stop();
      audio.removeEventListener("ended", instance.stop);

      const index = audioInstances.indexOf(instance);
      if (index !== -1) audioInstances.splice(index, 1);
    };
  }, [audioUrl]);

  const onClick = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioInstances.forEach((instance) => {
        if (instance.audio !== audioRef.current) {
          instance.stop();
        }
      });

      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <button className={classNames(styles.audioButton, {[styles.active]: isPlaying, [styles.ltr]: ltr})} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 45 45">
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
          />
          <path
            fill="#000"
            d="M14.975 24.543a2.15 2.15 0 1 0 0-4.3 2.15 2.15 0 0 0 0 4.3"
          />
          <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.297 27.714a7.5 7.5 0 0 0 2.204-5.321 7.5 7.5 0 0 0-2.204-5.322m5.321 15.963a15 15 0 0 0 4.408-10.643c0-4.155-1.685-7.918-4.408-10.641"
          />
        </mask>
        <g mask="url(#mask0_103_1238)">
          <path fill="#20487F" d="M-3.3-3.3h51.6v51.6H-3.3z" />
        </g>
      </svg>
    </button>
  );
};
