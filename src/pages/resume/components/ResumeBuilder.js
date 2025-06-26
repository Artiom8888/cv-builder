import { 
  Box, 
  Container, 
  Stack, 
  Heading,
  Input,
  Button
  // FormControl,
  // FormLabel,
  // useToast // Add this import
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { usePDF, targetRef } from 'react-to-pdf';
import { useRef, useState } from 'react'; // Add this import

const ResumeBuilder = () => {
  const { register, handleSubmit } = useForm();
  const { toPDF, targetRef } = usePDF({
    filename: 'page.pdf',
    page: {
      margin: 20,
      format: 'a4',
      orientation: 'portrait',
    },
  });
  const resumeRef = useRef(null);
  // const toast = useToast();
  // const [isExporting, setIsExporting] = useState(false);

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Heading>Create Your Resume</Heading>
        
        {/* Personal Information Section */}
        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Stack spacing={4}>
            <div>
              <h1>Full Name</h1>
              <Input {...register('fullName')} />
            </div>
            
            {/* Other form fields */}
          </Stack>
        </Box>

        {/* Experience Section */}
        <Box p={6} borderWidth="1px" borderRadius="lg">
          {/* Experience form fields */}
        </Box>

        <Button colorScheme="blue" onClick={toPDF()}>
          Export PDF
        </Button>
        <div ref={targetRef}>
            Content to be generated to PDF
         </div>
      </Stack>
    </Container>
  );
}

export default ResumeBuilder;