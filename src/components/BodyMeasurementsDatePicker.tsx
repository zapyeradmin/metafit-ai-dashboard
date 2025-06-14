
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
}

const BodyMeasurementsDatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={`h-8 w-[220px] justify-start text-left font-normal ${
          !date ? "text-muted-foreground" : ""
        }`}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date
          ? format(date, "dd/MM/yyyy", { locale: ptBR })
          : <span>Escolha uma data</span>
        }
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="center" side="bottom">
      <Calendar
        mode="single"
        locale={ptBR}
        selected={date}
        onSelect={setDate}
        disabled={(d) => d > new Date()}
        initialFocus
      />
    </PopoverContent>
  </Popover>
);

export default BodyMeasurementsDatePicker;
