import Banner from "@/components/Banner";
import FeaturedBrands from "@/components/brand/FeaturedBrands";
import WhyChooseBeautyVault from "@/components/WhyChooseBeautyVault";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import CustomerReview from "@/components/CustomerReview";
import Newsletter from "@/components/Newsletter";
import BeautyTalks from "@/components/BeautyTalks";

export const metadata = {
  title: "Home",
  description:
    "BeautyVault — Discover beauty without limits. Shop makeup, skincare and beauty essentials from the world's top brands.",
};

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedBrands />
      <WhyChooseBeautyVault />
      <FeaturedProducts />
      <BeautyTalks />
      <CustomerReview />
      <Newsletter />
    </>
  );
}
