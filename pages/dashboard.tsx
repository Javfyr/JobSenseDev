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
  useToast,
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
  const toast = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

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

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const response = await fetch('/api/getRecommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      toast({
        title: 'Failed to fetch recommendations',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleUploadResume = () => {
    setResumeUploaded(true);
    if (selectedRole) {
      toast({
        title: 'Resume uploaded',
        description: `You're now matched with the ${selectedRole} role.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchRecommendations();
    } else {
      toast({
        title: 'Resume uploaded',
        description: 'Please select a role to get personalized results.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
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
          minHeight="300px"
        >
          {resumeUploaded && selectedRole ? (
            loadingRecommendations ? (
              <Spinner color="purple.500" />
            ) : (
              <>
                <Text fontWeight="bold" mb={2}>Recommended Skills:</Text>
                <VStack align="start" spacing={2}>
                  {recommendations.map((rec, idx) => (
                    <Text key={idx}>• {rec}</Text>
                  ))}
                </VStack>
              </>
            )
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
