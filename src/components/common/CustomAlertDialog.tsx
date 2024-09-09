import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import Modal from "react-native-modal";

interface CustomAlertDialogProps {
  isVisible: boolean;
  onDismiss: () => void;
  onConfirm: (value: string) => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  isVisible,
  onDismiss,
  onConfirm,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue("");
  };

  return (
    <Modal isVisible={isVisible}>
      <View className="p-5 space-y-2 bg-white rounded">
        <Text>Are you sure you want to delete your account?</Text>
        <TextInput
          className="p-2 border border-gray-300 rounded"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholder="Type DELETE to confirm"
        />
        <View className="flex flex-row items-end justify-end">
          <Button title="Cancel" onPress={onDismiss} />
          <Button
            title="Delete Account"
            color={"red"}
            onPress={handleConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlertDialog;
