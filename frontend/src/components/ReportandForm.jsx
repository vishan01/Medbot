import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Button,
  Text,
  Stack,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loader.jsx";
import {
  LogOut,
  LayoutDashboard,
  Bot,
  Headset,
  UsersRound,
  HandHelping,
} from "lucide-react";

const ReportandForm = () => {
  const [fitnessData, setFitnessData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [storedFiles, setStoredFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/fetch-data");
      setFitnessData(response.data);
      setIsLoading(false);
    };
    fetchData();

    const files = JSON.parse(localStorage.getItem("storedFiles")) || [];
    setStoredFiles(files);
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const handleClick = () => {
    navigate("/about");
  };

  const handleClick1 = () => {
    navigate("/contact");
  };

  const handleClick2 = () => {
    navigate("/chatbotpage");
  };

  const handleClick3 = () => {
    navigate("/user");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile = {
          name: file.name,
          data: reader.result,
          type: file.type,
        };
        const updatedFiles = [...storedFiles, newFile];
        localStorage.setItem("storedFiles", JSON.stringify(updatedFiles));
        setStoredFiles(updatedFiles);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDelete = (index) => {
    const updatedFiles = storedFiles.filter((_, i) => i !== index);
    localStorage.setItem("storedFiles", JSON.stringify(updatedFiles));
    setStoredFiles(updatedFiles);
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <Flex direction="row" className="bg-[#354f52]" justify="space-between" align="start">
          <Box w="20%" h="100vh" p={4} className="z-10 sticky top-0 bg-[#354f52]">
            <Flex direction="column" justify="space-between" align="center" className="gap-12 h-full">
              <Flex align="center">
                <Text fontSize="xl" fontWeight="bold" className="text-[#cad2c5]">MEDBOT AI</Text>
              </Flex>
              <Flex className="h-full w-full px-16" direction="column" justify="space-between" align="start">
                <Flex className="h-full" direction="column" justify="start" align="start" gap={4}>
                  <Link href="#" onClick={handleClick3} fontSize="xl">
                    <Flex align="center" justify="center" gap={4}>
                      <LayoutDashboard color={"#cad2c5"} size={30} strokeWidth={1.5} />
                      <span className="font-semibold text-[#cad2c5]">Dashboard</span>
                    </Flex>
                  </Link>
                  <Link href="#" onClick={handleClick} fontSize="xl">
                    <Flex align="center" justify="center" gap={4}>
                      <UsersRound color={"#cad2c5"} size={36} strokeWidth={1.5} />
                      <span className="font-semibold text-[#cad2c5]">About Us</span>
                    </Flex>
                  </Link>
                  <Link href="#" onClick={handleClick1} fontSize="xl">
                    <Flex align="center" justify="center" gap={4}>
                      <Headset color={"#cad2c5"} size={36} strokeWidth={1.5} />
                      <span className="font-semibold text-[#cad2c5]">Contacts</span>
                    </Flex>
                  </Link>
                  <Link href="#" fontSize="xl">
                    <Flex align="center" justify="center" gap={4}>
                      <HandHelping color={"#FFFFFF"} size={36} strokeWidth={1.5} />
                      <span className="font-semibold text-[#FFFFFF]">Services</span>
                    </Flex>
                  </Link>
                  <Link href="#" onClick={handleClick2} fontSize="xl">
                    <Flex align="center" justify="center" gap={4}>
                      <Bot color={"#cad2c5"} size={36} strokeWidth={1.5} />
                      <span className="font-semibold text-[#cad2c5]">Chatbot</span>
                    </Flex>
                  </Link>
                </Flex>
                <Button variant="outline" size="2xl" ml={4} onClick={handleLogout} className="text-xl font-medium text-[#cad2c5]">
                  <LogOut color={"#cad2c5"} size={48} strokeWidth={2} />
                  Logout
                </Button>
              </Flex>
            </Flex>
          </Box>

          <Box className="w-full bg-[#cad2c5] rounded-tl-xl rounded-bl-2xl">
            <Flex direction="column" justify="space-between" align="start">
              <Box className="w-full border-b-2 rounded-tl-[128px] bg-[#cad2c5] border-[#354f52]" px={4} py={2} color="white">
                <Flex align="center" justify="end">
                  <Flex align="center">
                    <img src={fitnessData?.profilePhoto} className="w-12 h-12 rounded-full object-cover mr-2 border-4 border-[#cad2c5]" />
                    <Text className="text-[#354f52]" fontWeight="bold">{fitnessData?.userName}</Text>
                  </Flex>
                </Flex>
              </Box>

              <Flex direction="column" align="start" justify="start" className="w-full" p={4}>
                <Box className="p-8 rounded-xl w-full max-w-4xl mb-4">
                  <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.700" textAlign="left">Send an SMS</Text>
                  <Stack spacing={6}>
                    <input placeholder="Enter phone number" type="tel" className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <textarea placeholder="Enter your message" rows={3} className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 text-gray-800 resize-y focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <Button className="bg-green-400" size="lg" width="full">Send SMS</Button>
                  </Stack>
                </Box>

                <Box className="h-[43vh] p-8 rounded-xl w-full">
                  <Text fontSize="3xl" fontWeight="bold" mb={6} color="gray.700" textAlign="left">Manage Prescriptions</Text>
                  <Stack spacing={4}>
                      <Stack spacing={2}>
                        {storedFiles.map((file, index) => (
                          <Flex key={index} className="bg-gray-100" justify="space-between" align="center" p={2} borderWidth={1} borderRadius="md">
                            <Text isTruncated>{file.name}</Text>
                            <Flex gap={6}>
                              <a href={file.data} download={file.name} target="_blank" rel="noopener noreferrer">
                                <Button size="md" className="bg-blue-200 border-2 border-blue-600 text-[#354f52] px-4" >Download</Button>
                              </a>
                              <Button size="md" className="bg-red-600 text-white px-4" onClick={() => handleFileDelete(index)}>Delete</Button>
                            </Flex>
                          </Flex>
                        ))}
                      </Stack>
                      <input type="file" onChange={handleFileUpload} />
                  </Stack>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      )}
    </div>
  );
};

export default ReportandForm;
