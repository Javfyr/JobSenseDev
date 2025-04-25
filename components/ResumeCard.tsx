import React, { useRef } from 'react';
import {
  Box,
  Text,
  Flex,
  chakra,
  Icon,
  useColorModeValue,
  Select,
  Button,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

interface ResumeCardProps {
  resumeUploaded: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResumeClick?: () => void;
  onRoleSelect: (role: string) => void;
  onSubmitRole: () => void;
  availableRoles: string[];
  lockUpload?: boolean;
}

const ResumeCard: React.FC<ResumeCardProps> = ({
  resumeUploaded,
  onFileSelect,
  onResumeClick,
  onRoleSelect,
  onSubmitRole,
  availableRoles,
  lockUpload = false,
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const GradientText = chakra(Text, {
    baseStyle: {
      bgClip: 'text',
      bgGradient: 'linear(to-r, #7E00FB, #4B0095)',
      fontWeight: 'bold',
    },
  });

  return (
    <Box
      p={5}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="md"
    >
      <GradientText mb={3} fontSize="xl">
        Upload Your Resume
      </GradientText>
      <Text mb={3}>Please select the role you're interested in:</Text>

      <Select
        placeholder="Select a role"
        mb={4}
        onChange={(e) => onRoleSelect(e.target.value)}
      >
        {availableRoles.map((role, idx) => (
          <option key={idx} value={role}>
            {role}
          </option>
        ))}
      </Select>

      <Box
        as="label"
        htmlFor="resume-upload"
        display="block"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={borderColor}
        borderRadius="md"
        p={5}
        textAlign="center"
        cursor={lockUpload ? 'not-allowed' : 'pointer'}
        opacity={lockUpload ? 0.6 : 1}
      >
        <Icon as={FiUpload} w={10} h={10} mb={2} />
        <Text>Click to Upload</Text>
        <input
          id="resume-upload"
          type="file"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={onFileSelect}
          disabled={lockUpload}
        />
      </Box>

      <Button
        colorScheme="purple"
        mt={4}
        width="full"
        onClick={onSubmitRole}
        isDisabled={lockUpload}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ResumeCard;
