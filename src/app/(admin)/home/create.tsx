import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from "../../../api/products";
import RNPickerSelect from "react-native-picker-select";
import tw from "twrnc";

import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto"; 
import { supabase } from "../../../lib/supabase";
import { decode } from "base64-arraybuffer";  
import { Screen } from "../../../components/Screen";
import { InputField } from "../../../components/InputField";
import { Button } from "../../../components/Button";
import { options, categories, brands } from "../../../utils/data"; 
import { getAvailableSubtypes } from "../../../utils/generateSubtypes";
import DynamicForm from "../../../components/FormDyamic";
import { generateFieldsForCategory } from "../../../utils/generateFieldsForCategory";
import Colors from "../../../constants/Colors";
import { AppContainer } from "../../../components/AppContainer";
import { Space } from "../../../components/Space";
const { width } = Dimensions.get("window");

export default function CreateProductScreen() {
 const [title, setTitle] = useState("");
 const [description, setDescription] = useState("");
 const [selectedImages, setSelectedImages] = useState<string[]>([]);
 const [image, setImage] = useState("");
 const [category, setCategory] = useState("");
 const [avg_rating, setAvgRating] = useState("0");
 const [ratings, setRatings] = useState("0");
 const [brand, setBrand] = useState("");
 const [count, setCount] = useState("0");
 const [price, setPrice] = useState("0");
 const [sub_category, setSubCategory] = useState<string | null>(null);
 const [old_price, setOldPrice] = useState("0");
 const [product_details, setProductDetails] = useState({});
  
 const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString?.[0]);
  
  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id.toString());
  const { mutate: deleteProduct } = useDeleteProduct();
  
  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setTitle(updatingProduct.title || ""); // Ensure title is not null
      setDescription(updatingProduct.description || ""); // Ensure description is not null
      setSelectedImages(updatingProduct.images || []); // Ensure images is not null
      setImage(updatingProduct.image || ""); // Ensure image is not null
      setCategory(updatingProduct.category || ""); // Ensure category is not null
      setAvgRating(updatingProduct.avg_rating?.toString() || "0"); // Ensure avg_rating is not null
      setRatings(updatingProduct.ratings?.toString() || "0"); // Ensure ratings is not null
      setBrand(updatingProduct.brand || ""); // Ensure brand is not null
      setCount(updatingProduct.count?.toString() || "0"); // Ensure count is not null
      setPrice(updatingProduct.price?.toString() || "0"); // Ensure price is not null
      setSubCategory(updatingProduct.sub_category || ""); // Ensure sub_category is not null
      setOldPrice(updatingProduct.old_price?.toString() || "0"); // Ensure old_price is not null
      setProductDetails(updatingProduct.product_details || {}); // Ensure product_details is not null
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setSelectedImages([]);
    setImage("");
    setCategory("");
    setAvgRating("0");
    setRatings("0");
    setBrand("");
    setCount("0");
    setPrice("0");
    setSubCategory(null);
    setOldPrice("0");
    setProductDetails({});
  };

  const validateInput = () => {
    setErrors('');
    if (!title) {
      setErrors("Title is required");
      return false;
    }
    if (!description) {
      setErrors("Description is required");
      return false;
    }
    // if (!image) {
    //   setErrors("Image is required");
    //   return false;
    // }
    if (!category) {
      setErrors("Category is required");
      return false;
    }
    if (!avg_rating) {
      setErrors("Avg Rating is required");
      return false;
    }
    if (!ratings) {
      setErrors("Ratings is required");
      return false;
    }
    if (!brand) {
      setErrors("Brand is required");
      return false;
    }
    if (!count) {
      setErrors("Count is required");
      return false;
    }
    if (!price) {
      setErrors("Price is required");
      return false;
    }
    if (!sub_category) {
      setErrors("Sub Category is required");
      return false;
    }
    if (!old_price) {
      setErrors("Old Price is required");
      return false;
    }
    if (!product_details) {
      setErrors("Product Details is required");
      return false;
    }
    return true;
  }

  const onSubmit = () => { 
    if (isUpdating) {
      // update
      onUpdate();
    } else {
      // create
      onCreate();
    }
  }

 
  const onCreate = async () => { 
    if (!validateInput()) {
      return;
    }
    try {
      const imagePaths = await Promise.all(
        selectedImages.map(async (uri, index) => {
          const imagePath = await uploadImage(uri, index);
          return imagePath;
        })
      );

      const product = {
        title,
        description,
        images: imagePaths,
        image: imagePaths[0],
        brand,
        category,
        avg_rating: parseFloat(avg_rating),
        ratings: parseInt(ratings),
        count: parseInt(count),
        price: parseFloat(price),
        old_price: parseFloat(old_price),
        sub_category,
        product_details,
      };
      insertProduct(product, {
        onSuccess: () => {
          alert("Product created successfully");
          resetFields();
          router.back();
        },
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }

  const onUpdate = async() => {
    if (!validateInput()) {
      return;
    }

    try {
      const imagePaths = await Promise.all(
        selectedImages.map(async (uri, index) => {
          const imagePath = await uploadImage(uri, index);
          return imagePath;
        })
      );
      updateProduct(
        {
          id,
          title,
          description,
          images: imagePaths,
          image: imagePaths[0],
          brand,
          category,
          avg_rating: parseFloat(avg_rating),
          ratings: parseInt(ratings),
          count: parseInt(count),
          price: parseFloat(price),
          old_price: parseFloat(old_price),
          sub_category,
          product_details,
        },
        {
          onSuccess: () => {
            alert("Product updated successfully");
            resetFields();
            router.back();
          },
        }
      );
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    
  }

  const onDelete = () => { 
    deleteProduct(id.toString(), {
      onSuccess: () => {
        alert("Product deleted successfully");
        resetFields();
        router.back();
      },
      onError: (error) => {
        alert(error.message);
      },
    });
  }

  const confirmDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this product", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  };

const uploadImage = async (image: string, index: number) => {
  if (!image?.startsWith("file://")) {
    return;
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: "base64",
  });
  const filePath = `${randomUUID()}.png`;
  const contentType = "image/png";

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, decode(base64), { contentType });

  if (error) {
    console.log(error);
  }

  if (data) {
    return data.path;
  }
};

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
  
  return (
    <AppContainer>
      <View style={tw`flex-1 mb-10 mt-4 px-3`}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          style={styles.input}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          style={styles.input}
        />
        <Text style={styles.label}>Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Count</Text>
        <TextInput
          value={count}
          onChangeText={setCount}
          placeholder="Count"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Old Price</Text>
        <TextInput
          value={old_price}
          onChangeText={setOldPrice}
          placeholder="Old Price"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Ratings</Text>
        <TextInput
          value={ratings}
          onChangeText={setRatings}
          placeholder="Ratings"
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Avg Rating</Text>
        <TextInput
          value={avg_rating}
          onChangeText={setAvgRating}
          placeholder="Avg Rating"
          style={styles.input}
          keyboardType="numeric"
        />

        <Button
          text="Select Images"
          onPress={pickImages}
          style={{ marginTop: 10 }}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {selectedImages.map((uri) => (
            <View
              key={uri}
              style={{
                width: 100,
                height: 100,
                margin: 5,
                backgroundColor: "gray",
              }}
            >
              <Image
                source={{ uri }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          ))}
        </View>
        <Space height={20} />
        <View
          style={tw` flex-row  bg-white border-[1.5px] rounded-md h-13 justify-between px-2 border-slate-300 items-center relative`}
        >
          <View>
            <RNPickerSelect
              onValueChange={handleBrandChange}
              style={pickerSelectStyles}
              value={brand}
              placeholder={{ label: "Select a brand", value: null }}
              items={brands.map((brand) => ({
                label: brand,
                value: brand,
              }))}
            />
          </View>
          {showIconPlatform}
        </View>
        <Space height={20} />
        <View
          style={tw` flex-row  bg-white border-[1.5px] rounded-md h-13 justify-between px-2 border-slate-300 items-center relative`}
        >
          <View>
            <RNPickerSelect
              onValueChange={handleCategoryChange}
              style={pickerSelectStyles}
              value={category}
              placeholder={{ label: "Select a category", value: null }}
              items={categories.map((category) => ({
                label: category,
                value: category,
              }))}
            />
          </View>
          {showIconPlatform}
        </View>

        {category && (
          <View
            style={tw` flex-row mt-5 mb-5 bg-neutral-50 border-[1.5px] rounded-md h-13 justify-between px-2 border-slate-300 items-center relative`}
          >
            <View>
              <RNPickerSelect
                onValueChange={handleSubCategoryChange}
                style={pickerSelectStyles}
                value={sub_category}
                placeholder={{ label: "Select a subtype", value: null }}
                items={getAvailableSubtypes(category).map((subtype) => ({
                  label: subtype,
                  value: subtype,
                }))}
              />
            </View>
            {showIconPlatform}
          </View>
        )}
        {category && sub_category && (
          <DynamicForm
            fields={generateFieldsForCategory(category, sub_category)}
            onFieldChange={handleProductDetailsChange}
          />
        )}
        <Text style={{ color: "red" }}>{errors}</Text>
        <Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
        {isUpdating && (
          <Text onPress={confirmDelete} style={styles.textButton}>
            Delete
          </Text>
        )}
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
});

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