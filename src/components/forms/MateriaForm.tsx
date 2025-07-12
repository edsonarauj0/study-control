import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from "@/components/ui/EmojiPicker"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formMateriasSchema } from "@/schema/FormMateriasSchema"
import { SmileIcon } from "lucide-react"
import { NovaMateria } from "@/types/materias"
import React from "react"
import z from "zod"
import { useGlobalLoading } from "@/hooks/useGlobalLoading"

interface FormularioMateriasProps {
    onSubmit: (data: NovaMateria) => void
    defaultValues?: NovaMateria
    onCancel?: () => void
}

export function FormularioMaterias({
    onSubmit,
    defaultValues = { nome: "", professor: "", emoji: "" }
}: FormularioMateriasProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const { withLoading } = useGlobalLoading()

    const form = useForm<z.infer<typeof formMateriasSchema>>({
        resolver: zodResolver(formMateriasSchema),
        defaultValues
    })

    const handleSubmit = async (data: NovaMateria) => {
        await withLoading(async () => {
            await onSubmit(data)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome da matéria" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="professor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Professor</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do professor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="emoji"
                    render={({ field }) => (
                        <FormItem>
                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70s">Emoji</span>
                            <div className="flex flex-col gap-1">
                                <FormControl>
                                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" type="button">
                                                {field.value || <SmileIcon className="w-5 h-5 text-muted-foreground" />}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <EmojiPicker
                                                className="h-[300px]"
                                                onEmojiSelect={({ emoji }) => {
                                                    setIsOpen(false);
                                                    field.onChange(emoji);
                                                }}
                                                locale="pt"
                                            >
                                                <EmojiPickerSearch placeholder="Buscar emoji..." />
                                                <EmojiPickerContent />
                                                <EmojiPickerFooter />
                                            </EmojiPicker>

                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Salvar</Button>
            </form>
        </Form>
    )
}
