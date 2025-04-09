import { Box, Skeleton as MuiSkeleton, SxProps, Theme } from '@mui/material';

interface SkeletonProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  variant?: 'text' | 'rectangular' | 'circular';
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  count = 1,
  height = '1.2em',
  width = '100%',
  variant = 'rectangular',
  sx,
  style
}) => {
  return (
    <Box>
      {[...Array(count)].map((_, index) => (
        <MuiSkeleton
          key={index}
          variant={variant}
          height={height}
          width={width}
          sx={{ mb: 1, ...sx }}
          style={style}
          animation="wave"
        />
      ))}
    </Box>
  );
};

export default Skeleton; 