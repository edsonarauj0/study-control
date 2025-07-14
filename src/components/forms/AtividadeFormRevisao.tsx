import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { ChevronDownIcon, PlusCircle, Trash2 } from 'lucide-react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';

export function AtividadeFormRevisao() {
    const form = useFormContext();
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'revisoes',
    });
    const dataInicial = form.watch('dataInicial');
    const unidadeLabels: Record<string, string> = {
        dias: 'Dias',
        semanas: 'Semanas',
        meses: 'Meses',
    };
    return (
        <>
            <FormField
                control={form.control}
                name="dataInicial"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel htmlFor="dataInicial">Data Inicial</FormLabel>
                        <FormControl>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="date-picker" className="px-1">
                                        Date
                                    </Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date-picker"
                                                className="w-32 justify-between font-normal"
                                            >
                                                {date ? date.toLocaleDateString() : "Selecione uma data"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    setDate(date)
                                                    setOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="time-picker" className="px-1">
                                        Time
                                    </Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        defaultValue="10:30:00"
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />


            <div className="flex items-end gap-2">
                <FormField
                    control={form.control}
                    name="novoDia"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Dias para revisão</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Ex.: 7"
                                        value={field.value ? (typeof field.value === 'number' ? field.value : (field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value)) : ''}
                                        onChange={field.onChange}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="unidade"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FormField
                                                        control={form.control}
                                                        name="unidade"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Select
                                                                        value={field.value ? String(field.value) : 'dias'}
                                                                        onValueChange={(value) => field.onChange(value)}
                                                                    >
                                                                        <SelectTrigger className="w-[120px]">
                                                                            {field.value
                                                                                ? unidadeLabels[field.value]
                                                                                : 'Dias'}
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="dias">Dias</SelectItem>
                                                                            <SelectItem value="semanas">Semanas</SelectItem>
                                                                            <SelectItem value="meses">Meses</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />

                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        const dias = Number(form.getValues("novoDia"));
                        const unidade = form.getValues("unidade") || "dias";
                        if (!dias) return;

                        let diasCalculados = dias;
                        if (unidade === "semanas") {
                            diasCalculados = dias * 7;
                        } else if (unidade === "meses") {
                            diasCalculados = dias * 30; // Aproximação para meses
                        }

                        append({ dias: diasCalculados });
                        form.setValue("novoDia", new Date());
                        form.setValue("unidade", "dias");
                    }}
                >
                    <PlusCircle className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                {fields.map((field, index) => {
                    const diasField = field as { id: string; dias?: number }; // Ajuste de tipo
                    const dias = diasField.dias || 0;
                    const date = new Date(dataInicial);
                    date.setDate(date.getDate() + dias);
                    const formatted = date.toISOString().split('T')[0];
                    return (
                        <div key={field.id} className="flex items-end gap-2">
                            <FormField
                                control={form.control}
                                name={`revisoes.${index}.dias` as const}
                                render={({ field: diasField }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Dias</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...diasField} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Input type="date" value={formatted} readOnly className="w-40" />
                            <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
