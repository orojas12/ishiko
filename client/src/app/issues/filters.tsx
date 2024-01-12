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

export function Filter({
    selected,
    children,
}: {
    selected: string[];
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
                                {selected.map((value) => (
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

interface LabelFilterProps {
    labels: string[];
    filteredLabels: string[];
    setFilteredLabels: (labels: string[]) => void;
}
export function LabelFilter(props: LabelFilterProps) {
    const items = props.labels.map((label) => {
        return (
            <CommandItem
                key={label}
                value={label}
                onSelect={() => {
                    if (props.filteredLabels.includes(label)) {
                        props.setFilteredLabels(
                            props.filteredLabels.filter(
                                (value) => value !== label,
                            ),
                        );
                    } else {
                        props.setFilteredLabels([
                            ...props.filteredLabels,
                            label,
                        ]);
                    }
                }}
            >
                <Checkbox
                    className="mr-2"
                    checked={props.filteredLabels.includes(label)}
                />
                {label}
            </CommandItem>
        );
    });

    return (
        <Filter selected={props.filteredLabels}>
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>No results found</CommandEmpty>
                    {items}
                </CommandList>
            </Command>
        </Filter>
    );
}

export function IssueFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [labels, setLabels] = useState(params.get("label")?.split(",") || []);
    const [priorities, setPriorities] = useState(
        params.get("priority")?.split(",") || [],
    );

    useEffect(() => {
        setLabels(params.get("label")?.split(",") || []);
        setPriorities(params.get("priority")?.split(",") || []);
    }, [params]);

    const applyFilters = () => {
        const url = new URL("http://localhost:3000" + pathname);
        if (labels.length) {
            url.searchParams.set("label", labels.join());
        }
        if (priorities.length) {
            url.searchParams.set("priority", priorities.join());
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
                        labels={["bug", "feature", "docs", "other"]}
                        filteredLabels={labels}
                        setFilteredLabels={(labels) => setLabels(labels)}
                    />
                </div>
                <Button variant="secondary" onClick={applyFilters}>
                    Apply
                </Button>
            </PopoverContent>
        </Popover>
    );
}
