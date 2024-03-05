import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLakes } from "@/context/LakesContext";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

const CreateCaughtFishModal: React.FC = () => {
  const { lakes, isLoading, error } = useLakes();
  const [fishName, setFishName] = useState<string>("");
  const [caughtDate, setCaughtDate] = useState<string>(
    new Date().toISOString()
  );

  const [open, setOpen] = React.useState(false);
  const [selectedLake, setSelectedLake] = useState<any>(null);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (lakes && lakes.length > 0) {
      setSelectedLake(lakes[0]);
    }
  }, [lakes]);

  const fetchFishes = async (lakeId: string) => {
    try {
      const response = await axios.get(`/fetchFishes?lakeId=${lakeId}`);
      // Handle the response and update state accordingly
    } catch (error) {
      console.error("Error fetching fishes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedLake) return;

    try {
      const response = await axios.post("/createCaughtFishEntry", {
        lakeId: selectedLake.id,
        fishName,
        caughtAt: caughtDate,
      });

      if (response.status === 201) {
        // closeModal(); // Assuming you have a closeModal function
      } else {
        // Handle error
        console.error("Failed to create caught fish entry:", response.data);
      }
    } catch (error) {
      console.error("Error creating caught fish entry:", error);
    }
  };

  const closeModal = () => {
    // Implement your closeModal logic here
    console.log("Close modal logic");
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Pridėti pagautą žuvį
          </DialogTitle>
        </DialogHeader>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedLake ? selectedLake.name : "Parinkite ežerą..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search lake..." className="h-9" />
              <CommandEmpty>No lake found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {lakes?.map((lake) => (
                    <CommandItem
                      key={lake.id}
                      value={Number(lake.id)}
                      onSelect={(currentValue) => {
                        setSelectedLake(lake);
                        fetchFishes(currentValue);
                        setOpen(false);
                      }}
                    >
                      {lake.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedLake?.id === lake.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogDescription className="text-gray-600 p-6">
          <div className="mb-4">
            <label className="font-semibold text-lg">Žuvies pavadinimas:</label>
            <input
              type="text"
              value={fishName}
              onChange={(e) => setFishName(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold text-lg">Pagavimo data:</label>
            <input
              type="datetime-local"
              value={caughtDate}
              onChange={(e) => setCaughtDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <Button onClick={handleSubmit}>Pridėti</Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCaughtFishModal;
