"use client";

import { Field, Input, Button, Textarea, Stack, Box } from "@chakra-ui/react";
import { useActionState, useState } from "react";
import { addBookmark, type ActionState } from "@/app/action";

const initialState: ActionState = {
  errors: {},
};

export default function BookmarkForm() {
  const [state, formAction, pending] = useActionState(
    addBookmark,
    initialState,
  );
  const [values, setValues] = useState({ title: "", url: "", memo: "" });

  return (
    <form action={formAction}>
      <Stack gap={4}>
        <Field.Root required invalid={Boolean(state.errors?.title)}>
          <Field.Label>タイトル</Field.Label>
          <Input
            name="title"
            value={values.title}
            onChange={(event) =>
              setValues({ ...values, title: event.target.value })
            }
          />
          <Box minH="1.25em" display="flex" aria-live="polite">
            <Field.ErrorText>{state.errors?.title?.[0]}</Field.ErrorText>
          </Box>
        </Field.Root>

        <Field.Root required invalid={Boolean(state.errors?.url)}>
          <Field.Label>URL</Field.Label>
          <Input
            name="url"
            type="url"
            value={values.url}
            onChange={(event) =>
              setValues({ ...values, url: event.target.value })
            }
          />
          <Box minH="1.25em" display="flex" aria-live="polite">
            <Field.ErrorText>{state.errors?.url?.[0]}</Field.ErrorText>
          </Box>
        </Field.Root>

        <Field.Root required invalid={Boolean(state.errors?.memo)}>
          <Field.Label>一言メモ</Field.Label>
          <Textarea
            name="memo"
            value={values.memo}
            onChange={(event) =>
              setValues({ ...values, memo: event.target.value })
            }
          />
          <Box minH="1.25em" display="flex" aria-live="polite">
            <Field.ErrorText>{state.errors?.memo?.[0]}</Field.ErrorText>
          </Box>
        </Field.Root>

        <Button
          type="submit"
          alignSelf="flex-end"
          colorPalette="teal"
          variant="solid"
          px={"16px"}
          fontWeight={700}
          size={"lg"}
          disabled={pending}
        >
          {pending ? "登録中" : "登録する"}
        </Button>
      </Stack>
    </form>
  );
}
