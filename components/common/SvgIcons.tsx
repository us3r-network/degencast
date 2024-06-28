import Svg, { SvgProps, Path, Rect } from "react-native-svg";
export const ExploreIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill={props.fill || "#000"} {...props}>
    <Path d="m21.47 4.35-1.34-.56v9.03l2.43-5.86c.41-1.02-.06-2.19-1.09-2.61Zm-19.5 3.7L6.93 20a2.01 2.01 0 0 0 1.81 1.26c.26 0 .53-.05.79-.16l7.37-3.05c.75-.31 1.21-1.05 1.23-1.79.01-.26-.04-.55-.13-.81L13 3.5a1.954 1.954 0 0 0-1.81-1.25c-.26 0-.52.06-.77.15L3.06 5.45a1.994 1.994 0 0 0-1.09 2.6Zm16.15-3.8a2 2 0 0 0-2-2h-1.45l3.45 8.34" />
  </Svg>
);

export const TradeIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill={props.fill || "#000"} {...props}>
    <Path d="M6.75 6.75H3.75C3.336 6.75 3 7.086 3 7.5V20.25C3 20.6648 3.336 21 3.75 21H6.75C7.164 21 7.5 20.6648 7.5 20.25V7.5C7.5 7.086 7.164 6.75 6.75 6.75Z" />
    <Path d="M13.5 11.25H10.5C10.086 11.25 9.75 11.586 9.75 12V20.25C9.75 20.6648 10.086 21 10.5 21H13.5C13.9148 21 14.25 20.6648 14.25 20.25V12C14.25 11.586 13.9148 11.25 13.5 11.25Z" />
    <Path d="M20.25 3H17.25C16.8353 3 16.5 3.336 16.5 3.75V20.25C16.5 20.6647 16.8353 21 17.25 21H20.25C20.6648 21 21 20.6647 21 20.25V3.75C21 3.336 20.6648 3 20.25 3Z" />
  </Svg>
);

export const ActivityIcon = ({ fill, stroke, ...props }: SvgProps) => (
  <Svg width={24} height={24} fill={fill || "none"} {...props}>
    <Path
      d="M22.6667 12H20.1867C19.7497 11.9991 19.3244 12.1413 18.9759 12.405C18.6273 12.6686 18.3747 13.0392 18.2567 13.46L15.9067 21.82C15.8916 21.8719 15.86 21.9175 15.8167 21.95C15.7735 21.9825 15.7208 22 15.6667 22C15.6127 22 15.56 21.9825 15.5167 21.95C15.4735 21.9175 15.4419 21.8719 15.4267 21.82L9.90675 2.18C9.8916 2.12807 9.86002 2.08246 9.81675 2.05C9.77347 2.01754 9.72084 2 9.66675 2C9.61266 2 9.56002 2.01754 9.51675 2.05C9.47347 2.08246 9.44189 2.12807 9.42675 2.18L7.07675 10.54C6.95921 10.9592 6.70813 11.3285 6.36161 11.592C6.01509 11.8555 5.59207 11.9988 5.15675 12H2.66675"
      stroke={stroke || "#A36EFE"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PortfolioIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill={props.fill || "#000"} {...props}>
    <Path d="M9.848 15.55C11.2877 15.434 12.7343 15.434 14.174 15.55C14.9583 15.5955 15.7387 15.6934 16.51 15.843C18.18 16.181 19.27 16.733 19.737 17.623C20.087 18.317 20.087 19.143 19.737 19.838C19.27 20.728 18.223 21.315 16.493 21.618C15.722 21.773 14.941 21.874 14.157 21.92C13.43 22 12.703 22 11.968 22H10.644C10.3774 21.9652 10.1089 21.9475 9.84 21.947C9.05517 21.9065 8.27439 21.8082 7.504 21.653C5.834 21.333 4.744 20.763 4.277 19.873C4.09662 19.5275 4.00163 19.1438 4 18.754C3.99601 18.3611 4.08801 17.9732 4.268 17.624C4.727 16.734 5.817 16.156 7.504 15.844C8.278 15.692 9.061 15.594 9.848 15.551V15.55ZM12.003 2C14.903 2 17.253 4.418 17.253 7.4C17.253 10.383 14.903 12.8 12.003 12.8C9.103 12.8 6.75 10.384 6.75 7.4C6.75 4.418 9.101 2 12.002 2H12.003Z" />
  </Svg>
);

export const CommentIcon = (props: SvgProps) => (
  <Svg
    width={16}
    height={16}
    fill={props.fill || "none"}
    stroke={props.stroke || "#A36EFE"}
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 5.2C2 4.07989 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H10.8C11.9201 2 12.4802 2 12.908 2.21799C13.2843 2.40973 13.5903 2.71569 13.782 3.09202C14 3.51984 14 4.07989 14 5.2V9C14 9.93188 14 10.3978 13.8478 10.7654C13.6448 11.2554 13.2554 11.6448 12.7654 11.8478C12.3978 12 11.9319 12 11 12C10.6743 12 10.5114 12 10.3603 12.0357C10.1589 12.0832 9.97126 12.177 9.81234 12.3097C9.69315 12.4091 9.59543 12.5394 9.4 12.8L8.42667 14.0978C8.28192 14.2908 8.20955 14.3873 8.12082 14.4218C8.04311 14.452 7.95689 14.452 7.87918 14.4218C7.79045 14.3873 7.71808 14.2908 7.57333 14.0978L6.6 12.8C6.40457 12.5394 6.30685 12.4091 6.18766 12.3097C6.02874 12.177 5.84113 12.0832 5.63967 12.0357C5.48858 12 5.32572 12 5 12C4.06812 12 3.60218 12 3.23463 11.8478C2.74458 11.6448 2.35523 11.2554 2.15224 10.7654C2 10.3978 2 9.93188 2 9V5.2Z"
    />
  </Svg>
);

export const CommentIcon2 = (props: SvgProps) => {
  const width = props.width || 30;
  const height = props.height || 30;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 30 30`}
      fill={props.fill || "none"}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 9.75C3.75 7.6498 3.75 6.5997 4.15873 5.79754C4.51825 5.09193 5.09193 4.51825 5.79754 4.15873C6.5997 3.75 7.6498 3.75 9.75 3.75H20.25C22.3502 3.75 23.4003 3.75 24.2025 4.15873C24.9081 4.51825 25.4817 5.09193 25.8413 5.79754C26.25 6.5997 26.25 7.6498 26.25 9.75V16.875C26.25 18.6223 26.25 19.4959 25.9645 20.1851C25.5839 21.1039 24.8539 21.8339 23.9351 22.2145C23.2459 22.5 22.3723 22.5 20.625 22.5C20.0143 22.5 19.7089 22.5 19.4256 22.5669C19.0479 22.656 18.6961 22.8319 18.3981 23.0806C18.1747 23.2671 17.9914 23.5114 17.625 24L15.8 26.4333C15.5286 26.7952 15.3929 26.9761 15.2265 27.0408C15.0808 27.0975 14.9192 27.0975 14.7735 27.0408C14.6071 26.9761 14.4714 26.7952 14.2 26.4333L12.375 24C12.0086 23.5114 11.8253 23.2671 11.6019 23.0806C11.3039 22.8319 10.9521 22.656 10.5744 22.5669C10.2911 22.5 9.98572 22.5 9.375 22.5C7.62772 22.5 6.75408 22.5 6.06494 22.2145C5.14608 21.8339 4.41605 21.1039 4.03545 20.1851C3.75 19.4959 3.75 18.6223 3.75 16.875V9.75Z"
      />
    </Svg>
  );
};

export const EditIcon = (props: SvgProps) => {
  const width = props.width || 24;
  const height = props.height || 24;
  const stroke = props.stroke || "white";
  return (
    <Svg
      width={width}
      height={height}
      fill={props.fill || "none"}
      stroke={stroke}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12"
        strokeWidth="1.5"
      />
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.375 2.62523C18.7728 2.2274 19.3124 2.00391 19.875 2.00391C20.4376 2.00391 20.9772 2.2274 21.375 2.62523C21.7728 3.02305 21.9963 3.56262 21.9963 4.12523C21.9963 4.68784 21.7728 5.2274 21.375 5.62523L12 15.0002L8 16.0002L9 12.0002L18.375 2.62523Z"
        strokeWidth="1.5"
      />
    </Svg>
  );
};
export const HasSignerIcon = (props: SvgProps) => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 2H3.33333C2.97971 2 2.64057 2.14048 2.39052 2.39052C2.14048 2.64057 2 2.97971 2 3.33333V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V8"
      stroke="#1E293B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12.2499 1.75C12.5151 1.48478 12.8748 1.33578 13.2499 1.33578C13.625 1.33578 13.9847 1.48478 14.2499 1.75C14.5151 2.01521 14.6641 2.37493 14.6641 2.75C14.6641 3.12507 14.5151 3.48478 14.2499 3.75L7.99992 10L5.33325 10.6667L5.99992 8L12.2499 1.75Z"
      fill="#A36EFE"
      stroke="#1E293B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BackArrowIcon = (props: SvgProps) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        d="M2.62928 11.1007C2.02117 10.4926 2.02117 9.50733 2.62928 8.89922L9.85709 1.67141C10.1489 1.37963 10.5446 1.21572 10.9572 1.21572C11.3699 1.21572 11.7656 1.37963 12.0574 1.67141C12.3491 1.96318 12.5131 2.35892 12.5131 2.77155C12.5131 3.18418 12.3491 3.57991 12.0574 3.87169L5.92911 9.99995L12.0574 16.1282C12.3491 16.42 12.5131 16.8157 12.5131 17.2283C12.5131 17.641 12.3491 18.0367 12.0574 18.3285C11.7656 18.6203 11.3699 18.7842 10.9572 18.7842C10.5446 18.7842 10.1489 18.6203 9.85709 18.3285L2.62928 11.1007Z"
        fill="white"
      />
    </Svg>
  );
};

export const MintIcon = (props: SvgProps) => {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M14 8L8 14V8V2L14 8Z"
        fill="#4C2896"
        stroke="#4C2896"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14L2 8L8 2"
        stroke="#4C2896"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
