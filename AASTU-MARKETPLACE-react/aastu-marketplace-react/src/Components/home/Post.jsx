import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const PostModal = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Choose an image");

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/backend/items.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Item uploaded successfully ✅");
        setId("");
        setName("");
        setDescription("");
        setQuantity("");
        setCategory("");
        setPrice("");
        setImage(null);
      } else {
        alert(`Upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-modal-form">
      <input
        type="text"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "Posting…" : "Post Item"}
      </button>
    </form>
  );
};

export default PostModal;