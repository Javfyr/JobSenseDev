import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
  Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabaseClient';

interface AnalysisData {
  companyInformation: string;
  skillsRecommendation: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  overallAnalysis: string;
}

const TeamAnalysisReport: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { analysisData } = router.query;
  const [loading, setLoading] = useState<boolean>(true);
  const [teamAnalysisData, setTeamAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data?.session) {
        router.push('/auth/signin');
      } else {
        setUser(data.session.user);
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (analysisData) {
      try {
        const parsedData = JSON.parse(analysisData as string);
        setTeamAnalysisData(parsedData);
      } catch (err) {
        console.error('Failed to parse analysisData:', err);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [analysisData]);

  if (!user || loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!teamAnalysisData) {
    return <Text>No analysis data available.</Text>;
  }

  return (
    <Flex>
      <Box width="250px">
        <Sidebar />
      </Box>
      <Box p={8} flex="1">
        <VStack spacing={6} align="start">
          <Heading>Team Analysis Report</Heading>
          <Box>
            <Text fontWeight="bold">Company Information:</Text>
            <Text>{teamAnalysisData.companyInformation}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold">Skills Recommendation:</Text>
            <VStack align="start">
              {teamAnalysisData.skillsRecommendation.map((item, idx) => (
                <Text key={idx}>• {item}</Text>
              ))}
            </VStack>
          </Box>
          <Box>
            <Text fontWeight="bold">Weaknesses:</Text>
            <VStack align="start">
              {teamAnalysisData.weaknesses.map((item, idx) => (
                <Text key={idx}>• {item}</Text>
              ))}
            </VStack>
          </Box>
          <Box>
            <Text fontWeight="bold">Improvement Suggestions:</Text>
            <VStack align="start">
              {teamAnalysisData.improvementSuggestions.map((item, idx) => (
                <Text key={idx}>• {item}</Text>
              ))}
            </VStack>
          </Box>
          <Box>
            <Text fontWeight="bold">Overall Analysis:</Text>
            <Text>{teamAnalysisData.overallAnalysis}</Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default TeamAnalysisReport;
