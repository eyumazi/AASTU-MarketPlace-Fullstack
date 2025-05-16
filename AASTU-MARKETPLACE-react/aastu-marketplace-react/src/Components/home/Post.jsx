import React, { useState } from "react";
import { supabase } from "../../supabaseClient"; // adjust path if needed

const PostModal = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemImage) return alert("Choose an image");

    try {
      setLoading(true);

      /* ---------- 1️⃣  upload image to Supabase Storage ---------- */
      const fileExt = itemImage.name.split(".").pop();
      const fileName = `${Date.now()}_${itemName}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("uploads")
        .upload(filePath, itemImage);

      if (uploadErr) throw uploadErr;

      /* ---------- 2️⃣  get the public URL of that image ---------- */
      const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      /* ---------- 3️⃣  insert row into itemdetail table ---------- */
      const { error: insertErr } = await supabase.from("itemdetail").insert([
        {
          itemName,
          itemDescription,
          itemPrice: parseFloat(itemPrice),
          itemRate: 0,
          itemProfile: imageUrl,
        },
      ]);

      if (insertErr) throw insertErr;

      alert("Item uploaded successfully ✅");
      // clear form
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemImage(null);
    } catch (err) {
      console.error("Upload error:", err.message);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-modal-form">
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Item Description"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Item Price"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setItemImage(e.target.files[0])}
        required
      />

      <button type="submit" className="upload-btn" disabled={loading}>
        {loading ? "Posting…" : "Post Item"}
      </button>
    </form>
  );
};

export default PostModal;
