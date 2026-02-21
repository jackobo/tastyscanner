import styled from "styled-components";
import React from "react";

const DotsAnimationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  span {
    width: 10px;
    height: 10px;
    background-color: currentColor;
    border-radius: 50%;
    animation: dot-flash 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }

    &:nth-child(3) {
      animation-delay: 0s;
    }
  }

  @keyframes dot-flash {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;

export const DotsAnimationComponent: React.FC<{className?: string}> = (props) => {
    return (
        <DotsAnimationBox className={props.className}>
            <span></span>
            <span></span>
            <span></span>
        </DotsAnimationBox>
    );
}