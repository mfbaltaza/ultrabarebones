import type { NextPage } from "next";
import React, { ChangeEvent, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Component } from "../src/types";

const Card: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      style={{
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {children}
    </div>
  );
};

const Text: React.FC<{
  text: string;
  id: string;
  props: ComponentBoxProps;
}> = ({ text, id, props }) => {
  return (
    <Card>
      <ComponentBox
        getComponents={props.getComponents}
        data={props.data}
        component={props.component}
        edit={true}
        del={true}
        componentId={id}
      />
      <h1>Text</h1>
      <p>{text}</p>
    </Card>
  );
};

const Image: React.FC<{
  src: string;
  id: string;
  props: ComponentBoxProps;
}> = ({ src, id, props }) => {
  return (
    <Card>
      <h1>Image</h1>
      <ComponentBox
        getComponents={props.getComponents}
        data={props.data}
        component={props.component}
        edit={true}
        del={true}
        componentId={id}
      />
      <img
        src={src}
        alt="Image"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />
    </Card>
  );
};

interface ComponentBoxProps {
  getComponents: () => void;
  data: Component[];
  component: string;
  edit?: boolean;
  componentId?: string;
  del?: boolean;
}

const ComponentBox: React.FC<ComponentBoxProps> = ({
  getComponents,
  data,
  component,
  edit,
  componentId,
  del,
}: ComponentBoxProps) => {
  const [imageURL, setImageURL] = useState("");
  const [newText, setNewText] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageURL(e.target.value);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  };

  const addComponent = async () => {
    if (component === "image") {
      await fetch("/api/component", {
        method: "POST",
        body: JSON.stringify({
          id: data?.length ? data?.length + 1 : 1,
          type: "image",
          src: imageURL,
        }),
      });
      setImageURL("");
    } else if (component === "text") {
      await fetch("/api/component", {
        method: "POST",
        body: JSON.stringify({
          id: data?.length ? data?.length + 1 : 1,
          type: "text",
          text: newText,
        }),
      });
      setNewText("");
    }
    getComponents();
  };

  const editComponent = async () => {
    if (!componentId) console.error("You need component id");
    if (component === "image") {
      await fetch("/api/component", {
        method: "PUT",
        body: JSON.stringify({
          id: componentId,
          type: "image",
          src: imageURL,
        }),
      });
      setImageURL("");
    }
    if (component === "text") {
      await fetch("/api/component", {
        method: "PUT",
        body: JSON.stringify({
          id: componentId,
          type: "text",
          text: newText,
        }),
      });
      setNewText("");
    }
    getComponents();
  };

  const removeComponent = async () => {
    if (!componentId) console.error("You need component id");
    if (component === "image") {
      await fetch("/api/component", {
        method: "DELETE",
        body: JSON.stringify({
          id: componentId,
          type: "image",
          src: imageURL,
        }),
      });
      setImageURL("");
    }
    if (component === "text") {
      await fetch("/api/component", {
        method: "DELETE",
        body: JSON.stringify({
          id: componentId,
          type: "text",
          text: newText,
        }),
      });
      setNewText("");
    }
    getComponents();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <p>
          {edit ? "Edit" : "Add"} {component === "image" ? "image" : "text"}
        </p>
      </Dialog.Trigger>
      {del ? <p style={{marginTop: 0}} onClick={removeComponent}>Delete</p> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">
            {edit ? "Edit" : "Add"} {component === "image" ? "Image" : "Text"}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            {edit ? "Edit" : "Add"} a new{" "}
            {component === "image" ? "image" : "text"} component to your
            project.
          </Dialog.Description>
          {component === "image" ? (
            <fieldset className="Fieldset">
              <label className="URL" htmlFor="url">
                URL
              </label>
              <input
                className="Input"
                id="url"
                value={imageURL}
                onChange={handleChange}
              />
            </fieldset>
          ) : (
            <fieldset className="Fieldset">
              <input
                className="Input"
                type="text"
                value={newText}
                onChange={handleTextChange}
              />
            </fieldset>
          )}
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Close asChild>
              <button
                className="Button green"
                onClick={edit ? editComponent : addComponent}
              >
                Save changes
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              x
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Home: NextPage = () => {
  const [data, setData] = useState<Component[] | null>(null);

  const getComponents = () => {
    fetch("/api/component")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };

  useEffect(() => {
    getComponents();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        width: "400px",
        fontFamily: "Roboto, sans-serif",
        margin: "0 auto",
      }}
    >
      <div className="controls">
        <ComponentBox
          getComponents={getComponents}
          data={data}
          component="image"
        />
        <ComponentBox
          getComponents={getComponents}
          data={data}
          component="text"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxHeight: "60vh",
          overflow: "auto",
        }}
      >
        {data.map((component) => {
          if (component.type === "text") {
            return (
              <Text
                props={{ getComponents, data, component: "text" }}
                key={component.id}
                text={component.text}
                id={component.id}
              />
            );
          }
          if (component.type === "image") {
            return (
              <Image
                props={{ getComponents, data, component: "image" }}
                key={component.id}
                src={component.src}
                id={component.id}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default Home;
