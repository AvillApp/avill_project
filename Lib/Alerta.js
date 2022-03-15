import React from "react";
import {
  Alert,
  IconButton,
  HStack,
  VStack,
  CloseIcon,
  Text,
  Center,
  Box,
} from "native-base";

export default function Alerta({ title, texto, status }) {
  return (
    <Center>
      <Alert w="90%" maxW="400" status={status} colorScheme={status}>
        <VStack space={2} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack flexShrink={1} space={2} alignItems="center">
              <Alert.Icon />
              <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                {title}
              </Text>
            </HStack>
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" color="coolGray.600" />}
            />
          </HStack>
          <Box
            pl="6"
            _text={{
              color: "coolGray.600",
            }}
          >
            {texto}
          </Box>
        </VStack>
      </Alert>
    </Center>
  );
}
