import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Select,
  Grid,
  useColorModeValue,
  Flex,
  Spinner,
  Link,
} from '@chakra-ui/react';
import { MdLock } from 'react-icons/md';
import ProfileCard from '@/components/ProfileCard';
import SkillCard from '../components/SkillCard';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';

const DashboardPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData.session?.user) {
        router.push('/auth/signin');
        return;
      }
      setUser(sessionData.session.user);
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    const roles = ['Software Engineer', 'Data Scientist', 'Product Manager'];
    setAvailableRoles(roles);
  }, []);

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleUploadResume = () => {
    setResumeUploaded(true);
  };

  if (!user) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Link href="/">
          <Text fontSize="2xl" fontWeight="bold">JobSense</Text>
        </Link>
      </Flex>
      <Grid templateColumns={{ md: '1fr 2fr' }} gap={6}>
        <VStack spacing={4} align="stretch">
          <ProfileCard user={user} profileData={{ full_name: '', goals: [], current_role: '' }} />
          <Box p={5} bg={bgColor} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
            <Text mb={2}>Upload Resume</Text>
            <Button onClick={handleUploadResume} colorScheme="purple" width="full">
              Upload Resume
            </Button>
            <Select placeholder="Select Role" mt={3} onChange={handleRoleSelect}>
              {availableRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </Select>
          </Box>
        </VStack>
        <Box
          p={5}
          bg={bgColor}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          height="300px"
        >
          {resumeUploaded && selectedRole ? (
            <Text>Resume uploaded for role: {selectedRole}</Text>
          ) : (
            <Flex
              direction="column"
              justify="center"
              align="center"
              height="100%"
              border="1px dashed"
              borderColor={borderColor}
              borderRadius="md"
              p={5}
            >
              <MdLock size={24} />
              <Text textAlign="center">Upload your resume and select a role to begin.</Text>
            </Flex>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
