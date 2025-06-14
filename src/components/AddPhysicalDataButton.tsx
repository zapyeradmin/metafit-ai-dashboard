
import React from "react";
import { Button } from "@/components/ui/button";

interface AddPhysicalDataButtonProps {
  onClick: () => void;
}

const AddPhysicalDataButton: React.FC<AddPhysicalDataButtonProps> = ({ onClick }) => (
  <div className="flex justify-end my-4">
    <Button onClick={onClick}>
      Adicionar novos dados
    </Button>
  </div>
);

export default AddPhysicalDataButton;
