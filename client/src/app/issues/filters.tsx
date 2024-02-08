"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IssueLabel, IssueStatus } from "@/types";

export function Filter({
    selectedValues,
    children,
}: {
    selectedValues: string[];
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col w-64 gap-2">
            <Label htmlFor="filter-label">Label</Label>
            <Popover>
                <div className="flex justify-end">
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="p-1 rounded-sm w-full flex justify-between"
                        >
                            <div className="flex gap-1">
                                {selectedValues.map((value) => (
                                    <Badge key={value} variant="outline">
                                        {value}
                                    </Badge>
                                ))}
                            </div>
                            <ChevronDown />
                        </Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent className="w-64 flex justify-start">
                    {children}
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function LabelFilterItem({
    selected,
    label,
    toggleLabel,
}: {
    selected: boolean;
    label: IssueLabel;
    toggleLabel: (label: IssueLabel) => void;
}) {
    return (
        <CommandItem key={label.id} onSelect={() => toggleLabel(label)}>
            <Checkbox className="mr-2" checked={selected} />
            {label.name}
        </CommandItem>
    );
}

interface LabelFilterProps {
    labels: IssueLabel[];
    filterLabels: string[];
    setFilterLabels: (labels: string[]) => void;
}
export function LabelFilter(props: LabelFilterProps) {
    function toggleLabel(label: IssueLabel) {
        // remove label if already selected
        if (props.filterLabels.includes(label.id.toString())) {
            props.setFilterLabels(
                props.filterLabels.filter(
                    (filterLabel) => filterLabel !== label.id.toString()
                )
            );
        } else {
            // add label if not selected
            props.setFilterLabels([...props.filterLabels, label.id.toString()]);
        }
    }

    return (
        <Filter selectedValues={props.filterLabels}>
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    {props.labels.map((label) => (
                        <LabelFilterItem
                            label={label}
                            toggleLabel={toggleLabel}
                            selected={props.filterLabels.includes(
                                label.id.toString()
                            )}
                        />
                    ))}
                </CommandList>
            </Command>
        </Filter>
    );
}

export function IssueFilters({
    statuses,
    labels,
}: {
    statuses: IssueStatus[];
    labels: IssueLabel[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [filterLabels, setFilterLabels] = useState(
        params.get("label")?.split(",") || []
    );
    const [filterPriorities, setFilterPriorities] = useState(
        params.get("priority")?.split(",") || []
    );

    useEffect(() => {
        setFilterLabels(params.get("label")?.split(",") || []);
        setFilterPriorities(params.get("priority")?.split(",") || []);
    }, [params]);

    const applyFilters = () => {
        const url = new URL("http://localhost:3000" + pathname);
        if (filterLabels.length) {
            url.searchParams.set("label", filterLabels.join());
        }
        if (filterPriorities.length) {
            url.searchParams.set("priority", filterPriorities.join());
        }
        router.push(url.toString());
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Filter</Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-auto flex flex-col gap-4"
            >
                <div className="flex flex-col">
                    <LabelFilter
                        labels={labels}
                        filterLabels={filterLabels}
                        setFilterLabels={(labels) => setFilterLabels(labels)}
                    />
                </div>
                <Button variant="secondary" onClick={applyFilters}>
                    Apply
                </Button>
            </PopoverContent>
        </Popover>
    );
}
