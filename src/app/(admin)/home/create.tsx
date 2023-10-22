import { useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");


export default function CreateProductScreen() {
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [uploadedImages, setUploadedImages] = useState<
   { url: string; originalUri: string }[]
 >([]);
 const [selectedImages, setSelectedImages] = useState<string[]>([]);
 const [image, setImage] = useState<{ url: string; originalUri: string }>({
   url: "",
   originalUri: "",
 });
 const [category, setCategory] = useState("");
 const [avg_rating, setAvgRating] = useState("0");
 const [ratings, setRatings] = useState("0");
 const [brand, setBrand] = useState("");
 const [count, setCount] = useState("0");
 const [price, setPrice] = useState("0");
 const [subCategory, setSubCategory] = useState<string | null>(null);
 const [old_price, setOldPrice] = useState("0");
 const [product_details, setProductDetails] = useState<Record<string, string>>(
   {}
 );
  
  const handleCreateProduct = () => { 
    const product = {
      title,
      description,
      images: uploadedImages,
      image: uploadedImages[0],
      brand,
      category,
      avg_rating: parseFloat(avg_rating),
      ratings: parseInt(ratings),
      count: parseInt(count),
      price: parseFloat(price),
      old_price: parseFloat(old_price),
      subCategory,  
      product_details,
    }
  }

  const handleCategoryChange = (value: string) => { 
    setCategory(value);
    setSubCategory(null);
    setProductDetails({});
  }

  const handleBrandChange = (value: string) => { 
    setBrand(value);
    setProductDetails({});
  }

  const handleSubCategoryChange = (value: string) => { 
    setSubCategory(value);
    setProductDetails({});
  }

  const handleProductDetailsChange = (key: string, value: string) => { 
    setProductDetails((prev) => ({ ...prev, [key]: value }));
  }

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map(({ uri }) => uri));
    } else {
      alert("You haven't selected any image");
    }
  };

  const showIconPlatform =
    Platform.OS === "android" ? (
      <></>
    ) : (
      <MaterialIcons
        style={{ position: "absolute", right: 10, top: 10 }}
        name="keyboard-arrow-down"
        size={25}
        color="black"
      />
    );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    color: "black",
    paddingVertical: 10,
    width: width,
  },
  inputAndroid: {
    fontSize: 15,
    color: "black",
    paddingVertical: 10,
    paddingRight: width - 30,
  },
});