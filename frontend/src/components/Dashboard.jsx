import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Button, Text, Stack, Link, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HealthStatsCard from "./HealthStatsCard.jsx";
import ActivityCard from "./ActivityCard.jsx";
import FatGraph from "./FatGraph.jsx";
import Loading from "./Loader.jsx";
import {
  LogOut,
  LayoutDashboard,
  Bot,
  Headset,
  UsersRound,
  HandHelping,
} from "lucide-react";
import { ChakraProvider } from "@chakra-ui/react";
const Dashboard = () => {
  const [fitnessData, setFitnessData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [colorMode, toggleColorMode] = useState("light");
  let result;

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/fetch-data");
      console.log(response.data);
      setFitnessData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (fitnessData) {
    result = fitnessData?.formattedData.map(({ date, step_count }) => {
      const trimmeddate = date.substr(0, 3);
      return { date: trimmeddate, step_count };
    });
  }

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/");
  };

  const handleClick = () => {
    console.log("About Us clicked");
    navigate("/"); // Replace "/another-page" with the desired URL
  };
  const handleClick1 = () => {
    navigate("/"); // Replace "/another-page" with the desired URL
  };
  const handleClick2 = () => {
    navigate("/chatbotpage"); // Replace "/another-page" with the desired URL
  };
  const handleClick3 = () => {
    navigate("/Services"); // Replace "/another-page" with the desired URL
  };

  const heartPoints = fitnessData?.formattedData.map((item) => ({
    heartPoints: item.heart_points,
  }));

  const calories = fitnessData?.formattedData.map((item) => ({
    calories: item.calories,
  }));

  const maxWeight = fitnessData?.formattedData.reduce(
    (max, item) => (item.weight > max ? item.weight : max),
    0
  );
  const maxHeight = fitnessData?.formattedData.reduce(
    (max, item) => (item.height_in_cms > max ? item.height_in_cms : max),
    0
  );

  let maxBPArray = [];

  fitnessData?.formattedData.forEach((item) => {
    const itemMaxBP = Math.max(...item.blood_pressure);
    if (itemMaxBP > Math.max(...maxBPArray)) {
      maxBPArray = item.blood_pressure;
    }
  });

  const StepCount = fitnessData?.formattedData.reduce(
    (max, item) => (item.step_count > max ? item.step_count : max),
    0
  );
  const HeartPoints = fitnessData?.formattedData.reduce(
    (max, item) => (item.heart_points > max ? item.heart_points : max),
    0
  );
  const heartrate = fitnessData?.formattedData.reduce(
    (max, item) => (item.heart_rate > max ? item.heart_rate : max),
    0
  );

  return (
    <>
      <div className="w-full">
        {isLoading ? (
          <Loading />
        ) : (
          <Flex
            direction="row"
            className="bg-[#354f52]"
            justify="space-between"
            align="start"
          >
            <Box
              w="20%"
              h="100vh"
              p={4}
              className="z-10 sticky top-0 bg-[#354f52]"
            >
              <Flex
                direction="column"
                justify="space-between"
                align="center"
                className="gap-12 h-full"
              >
                <Flex align="center">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    className="text-[#cad2c5]"
                  >
                    MEDBOT AI
                  </Text>
                </Flex>
                <Flex
                  className="h-full w-full px-16"
                  direction="column"
                  justify="space-between"
                  align="start"
                >
                  <Flex
                    className="h-full"
                    direction="column"
                    justify="start"
                    align="start"
                    gap={4}
                  >
                    <Link
                      href="#"
                      color={colorMode === "light" ? "teal.500" : "white"}
                      fontWeight="bold"
                      _hover={{ textDecoration: "none" }}
                      _focus={{ outline: "none" }}
                      as="a"
                      _notLast={{ mb: 2 }}
                      fontSize="xl"
                    >
                      <Flex align="center" justify="center" gap={4}>
                        <LayoutDashboard
                          color={"#FFFFFF"}
                          size={30}
                          strokeWidth={1.5}
                        />
                        <span className="font-semibold text-[#FFFFFF]">
                          Dashboard
                        </span>
                      </Flex>
                    </Link>
                    <Link
                      href="#"
                      onClick={handleClick}
                      color={colorMode === "light" ? "teal.500" : "white"}
                      fontWeight="bold"
                      _hover={{ textDecoration: "none" }}
                      _focus={{ outline: "none" }}
                      as="a"
                      _notLast={{ mb: 2 }}
                      fontSize="xl"
                    >
                      <Flex align="center" justify="center" gap={4}>
                        <UsersRound
                          color={"#cad2c5"}
                          size={36}
                          strokeWidth={1.5}
                        />
                        <span className="font-semibold text-[#cad2c5]">
                          About Us
                        </span>
                      </Flex>
                    </Link>
                    <Link
                      href="#"
                      onClick={handleClick1}
                      color={colorMode === "light" ? "teal.500" : "white"}
                      fontWeight="bold"
                      _hover={{ textDecoration: "none" }}
                      _focus={{ outline: "none" }}
                      as="a"
                      _notLast={{ mb: 2 }}
                      fontSize="xl"
                    >
                      <Flex align="center" justify="center" gap={4}>
                        <Headset
                          color={"#cad2c5"}
                          size={36}
                          strokeWidth={1.5}
                        />
                        <span className="font-semibold text-[#cad2c5]">
                          Contacts
                        </span>
                      </Flex>
                    </Link>
                    <Link
                      href="#"
                      onClick={handleClick3}
                      color={colorMode === "light" ? "teal.500" : "white"}
                      fontWeight="bold"
                      _hover={{ textDecoration: "none" }}
                      _focus={{ outline: "none" }}
                      as="a"
                      _notLast={{ mb: 2 }}
                      fontSize="xl"
                    >
                      <Flex align="center" justify="center" gap={4}>
                        <HandHelping
                          color={"#cad2c5"}
                          size={36}
                          strokeWidth={1.5}
                        />
                        <span className="font-semibold text-[#cad2c5]">
                          Services
                        </span>
                      </Flex>
                    </Link>
                    <Link
                      href="#"
                      onClick={handleClick2}
                      color={colorMode === "light" ? "teal.500" : "white"}
                      fontWeight="bold"
                      _hover={{ textDecoration: "none" }}
                      _focus={{ outline: "none" }}
                      as="a"
                      _notLast={{ mb: 2 }}
                      fontSize="xl" // Increased text size
                    >
                      <Flex align="center" justify="center" gap={4}>
                        <Bot color={"#cad2c5"} size={36} strokeWidth={1.5} />{" "}
                        {/* Adjust size as needed */}
                        <span className="font-semibold text-[#cad2c5]">
                          Chatbot
                        </span>
                      </Flex>
                    </Link>
                  </Flex>
                  <Button
                    colorScheme={colorMode === "light" ? "white" : "blue"}
                    variant="outline"
                    size="2xl"
                    ml={4}
                    onClick={handleLogout}
                    className="text-xl font-medium text-[#cad2c5]"
                  >
                    <LogOut color={"#cad2c5"} size={48} strokeWidth={2} />
                    Logout
                  </Button>
                </Flex>
              </Flex>
            </Box>

            <Box
              className="w-full bg-[#cad2c5] rounded-tl-xl rounded-bl-2xl " // Apply rounded corners to the whole flex container
            >
              <Flex direction="column" justify="space-between" align="start">
                <Box
                  className="w-full border-b-2 rounded-tl-[128px] bg-[#cad2c5] border-[#354f52]"
                  px={4}
                  py={2}
                  color="white"
                >
                  <Flex align="center" justify="end">
                    <Flex align="center">
                      <img
                        size="sm"
                        name="John Doe"
                        src={fitnessData?.profilePhoto}
                        mr={2}
                        className="w-12 h-12 rounded-full object-cover mr-2 border-4 border-[#cad2c5]"
                      />
                      <Text className="text-[#354f52]" fontWeight="bold">
                        {fitnessData?.userName}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
                <Flex align="center" w="100%" p={4}>
                  <Stack spacing={4}>
                    <HealthStatsCard
                      weight={maxWeight}
                      height={maxHeight}
                      BP={maxBPArray}
                      step={StepCount}
                      heart={heartrate}
                    />
                    <ActivityCard result={result} heartPoints={heartPoints} />
                    <FatGraph calories={calories} />
                  </Stack>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        )}
      </div>
    </>
  );
};

export default Dashboard;
