import { Button, Checkbox, Group, Stack, Textarea, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useState, type FC } from "react";

// Типы для формы
interface FormValues {
  originalURL: string;
  slug: string;
  description: string;
  expiresAt: string | null;
  isActive: boolean;
}

const EditorForm: FC = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    mode: "uncontrolled",
    initialValues: {
      originalURL: "",
      slug: "",
      description: "",
      expiresAt: null,
      isActive: true,
    },

    validate: {
      originalURL: (value) => {
        if (!value) return "URL is required";
        if (!/^https?:\/\/.+/.test(value)) {
          return "URL must start with http:// or https://";
        }
        try {
          new URL(value);
          return null;
        } catch {
          return "Invalid URL format";
        }
      },

      slug: (value) => {
        if (!value) return "Slug is required";
        if (value.length < 3) return "Slug must be at least 3 characters";
        if (value.length > 50) return "Slug must be less than 50 characters";
        if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
          return "Slug can only contain letters, numbers, hyphens and underscores";
        }
        return null;
      },

      expiresAt: (value, values) => {
        if (values.isActive && value && new Date(value) < new Date()) {
          return "Expiration date cannot be in the past for active links";
        }
        return null;
      },

      description: (value) => {
        if (value && value.length > 500) {
          return "Description must be less than 500 characters";
        }
        return null;
      },
    },

    validateInputOnChange: ["originalURL", "slug"],
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      console.log("Form values:", values);

      // Здесь будет API вызов
      // const response = await createLink(values);

      // Сброс формы после успешной отправки
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Group gap="xs" wrap="nowrap" align="top" mb="xs">
          {/* URL Input */}
          <TextInput
            variant="filled"
            w="100%"
            withAsterisk
            label="Original URL"
            placeholder="https://google.com"
            key={form.key("originalURL")}
            {...form.getInputProps("originalURL")}
            error={form.errors.originalURL}
            styles={{
              error: {
                position: "absolute",
                top: "100%",
              },
              root: {
                height: 62,
                position: "relative",
              },
            }}
          />
          {/* Slug Input */}
          <TextInput
            variant="filled"
            w="100%"
            withAsterisk
            label="Slug"
            placeholder="my-cool-link"
            key={form.key("slug")}
            {...form.getInputProps("slug")}
            error={form.errors.slug}
            styles={{
              error: {
                position: "absolute",
                top: "100%",
              },
              root: {
                height: 62,
                position: "relative",
              },
            }}
          />
        </Group>

        {/* Description Textarea */}
        <Textarea
          variant="filled"
          label="Description"
          description="Optional description for your link"
          autosize
          minRows={2}
          maxRows={4}
          placeholder="This is my link..."
          key={form.key("description")}
          {...form.getInputProps("description")}
          error={form.errors.description}
        />

        {/* Date Picker */}
        <DatePickerInput
          variant="filled"
          label="Expiration Date"
          description="Optional: when this link should expire"
          placeholder="Pick expiration date"
          value={form.values.expiresAt}
          onChange={(date) => form.setFieldValue("expiresAt", date)}
          minDate={new Date().toDateString()}
          clearable
        />

        {/* Active Checkbox */}
        <Checkbox
          label="Active"
          description="Enable or disable this link"
          size="md"
          checked={form.values.isActive}
          onChange={(event) => form.setFieldValue("isActive", event.currentTarget.checked)}
        />

        {/* Submit Button */}
        <Group justify="flex-end" mt="md">
          <Button type="button" variant="outline" onClick={() => form.reset()} disabled={loading}>
            Reset
          </Button>
          <Button type="submit" loading={loading} disabled={!form.isValid()}>
            Create Link
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default EditorForm;
