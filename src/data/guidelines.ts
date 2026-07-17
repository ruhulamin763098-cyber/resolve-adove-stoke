import { CommonGuideline } from "../types";

export const ADOBE_STOCK_GUIDELINES: CommonGuideline[] = [
  {
    title: "Technical Quality / Soft Focus & Blur",
    rejectionReason: "One of the most common rejections. Adobe inspects images at 100% zoom. Any camera shake, out-of-focus subjects, or soft pixels can cause a rejection.",
    solution: "Use a dedicated high-quality AI Upscaler (like Magnific, Topaz Gigapixel, or Real-ESRGAN) to regenerate sharp details. If photographing, use a higher shutter speed and stabilize.",
    tips: [
      "View your image at 100% zoom (1:1 pixel level) before uploading.",
      "Apply high-pass filtering or localized sharpening on the main subject.",
      "Avoid upscaling low-resolution web images using simple bilinear resizing."
    ]
  },
  {
    title: "Artifacts, Noise & Banding",
    rejectionReason: "Usually caused by excessive compression (JPEG artifacts), aggressive post-processing, low-light sensors, or bad AI generation in gradient areas (like skies).",
    solution: "Use noise reduction tools. In Photoshop, apply a very subtle blur/noise reduction or camera-raw filter on flat background surfaces (like sky or studio walls).",
    tips: [
      "Save images in high-quality JPEG (Quality 10-12, sRGB color profile).",
      "Check solid color gradients (skies, flat tables) for color 'banding' or blocks.",
      "Use dithering in your editor to smooth out harsh gradients."
    ]
  },
  {
    title: "Intellectual Property & Trademarks",
    rejectionReason: "Adobe Stock strictly forbids visible logos, brand names, registered design elements (like the Nike Swoosh, Apple logo, or recognizable 3-stripe shoes), and protected buildings/landmarks.",
    solution: "Use the clone stamp, spot healing brush, or Photoshop Generative Fill to completely remove any visible brand tags, text, or trademarked shapes.",
    tips: [
      "Scan the image for accidental text, street signs, license plates, or logo shapes.",
      "Remove recognizable clothing brand logos, computer logos, or car badges.",
      "Even generic-looking phone shapes must not have signature brand buttons."
    ]
  },
  {
    title: "Generative AI Distortion & Hallucinations",
    rejectionReason: "Adobe accepts Generative AI images, but rejects those with obvious distortion: extra fingers, overlapping eyes, floating elements, text gibberish, or impossible physics.",
    solution: "Use Inpainting (Generative Fill) to fix anatomical errors. Use Photoshop, Krea, or Magnific to redraw hands, faces, and text artifacts.",
    tips: [
      "Carefully count fingers and toes. Ensure eyes are pointing in the same direction.",
      "Avoid submitting images with melted background details or weird organic fusions.",
      "Make sure generated text is fully legible or entirely erased/inpainted out."
    ]
  },
  {
    title: "Metadata / Forbidden Titles & Keywords",
    rejectionReason: "Adobe rejects submissions that use spammy keywords, keyword stuffing, or titles with buzzwords like 'hyperdetailed', 'masterpiece', 'trending on ArtStation', or '4K'. Mentioning 'AI' in the Title is also rejected.",
    solution: "Write simple, factual, and objective titles (e.g., 'Golden retriever dog sitting on grass'). List keywords in order of strict relevance. Don't spam unrelated tags.",
    tips: [
      "Select 'Created using generative AI tools' checkbox when submitting.",
      "Never write 'AI generated', 'Midjourney', or 'Stable Diffusion' in titles.",
      "Keep keywords under 50. Adobe permits 5-50 keywords; 15-35 is the sweet spot."
    ]
  },
  {
    title: "Similar Content / Spam",
    rejectionReason: "Uploading 20 nearly identical variations of the same prompt (e.g. slightly different poses of the same character) is flagged as spam and can get your account suspended.",
    solution: "Only submit your 1-2 best variations of a concept. Ensure they are visually distinct, with different compositions, lighting, or primary elements.",
    tips: [
      "Do not do bulk batch submissions of the same generative run.",
      "Make sure each submitted file offers distinct value to a buyer."
    ]
  }
];

export const ADOBE_STOCK_GUIDELINES_BN: CommonGuideline[] = [
  {
    title: "১. ফোকাস এবং ব্লার সমস্যা (Soft Focus & Blur)",
    rejectionReason: "শনাক্তকরণ: AI আপনার ছবির পিক্সেল লেভেল স্ক্যান করে দেখে যে কোনো কাঁপুনির (camera shake) কারণে ছবি ঝাপসা হয়েছে কি না। এডোবি প্রতিটি ফাইল ১০০% জুমে পরীক্ষা করে দেখে।",
    solution: "সমাধান: অ্যাপের গাইডলাইনে এবং AI ডায়াগনস্টিক রিপোর্টে সুনির্দিষ্টভাবে বলা হয় কীভাবে AI Upscaler (যেমন Topaz Gigapixel, Magnific বা Real-ESRGAN) অথবা Photoshop-এর Sharpening টুলের মাধ্যমে ছবির ডিটেইলস ক্রিস্প ও শার্প করা যাবে।",
    tips: [
      "আপলোড করার আগে ছবিটি ১০০% জুম (১:১ পিক্সেল লেভেল) করে দেখে নিন কোনো ঝাঁকুনি আছে কি না।",
      "প্রধান সাবজেক্টে শার্পেনিং টুল বা হাই-পাস ফিল্টার ব্যবহার করে ডিটেইলস ক্রিস্প করুন।",
      "কম রেজোলিউশনের ওয়েব ইমেজ সাধারণ বাইলিনিয়ার পদ্ধতিতে রিসাইজ করা পরিহার করুন।"
    ]
  },
  {
    title: "২. লাইটিং এবং এক্সপোজার সমস্যা (Exposure & Highlights)",
    rejectionReason: "শনাক্তকরণ: ছবিতে কোনো জায়গায় অতিরিক্ত আলো (Overexposure/blown-out highlights) বা খুব বেশি অন্ধকার (Underexposure) আছে কি না তা আমাদের AI এনালাইসিস রিপোর্টে চলে আসে।",
    solution: "সমাধান: ক্যামেরা-র ফিল্টার বা হিস্টোগ্রাম অ্যাডজাস্টমেন্টের সঠিক নিয়ম এবং Photoshop-এর শ্যাডো-হাইলাইট ঠিক করার সুনির্দিষ্ট কাজের ধাপ এটি সাজেস্ট করে।",
    tips: [
      "আপনার এডিটিং সফটওয়্যারের হিস্টোগ্রাম চেক করুন যাতে কোনো ব্রাইট হাইলাইট ডিটেইল হারিয়ে না যায়।",
      "Photoshop-এর Shadows/Highlights অ্যাডজাস্টমেন্ট ব্যবহার করে ব্যালেন্সড ডায়নামিক রেঞ্জ তৈরি করুন।",
      "অতিরিক্ত কনট্রাস্ট বা কালার স্যাচুরেশন এড়িয়ে চলুন যা ছবির মান নষ্ট করতে পারে।"
    ]
  },
  {
    title: "৩. আর্টিফ্যাক্টস এবং অতিরিক্ত নয়েজ (Artifacts, Noise & Excessive Filtering)",
    rejectionReason: "শনাক্তকরণ: কম্প্রেশন (JPEG artifacts), রঙের গ্রেডিয়েন্টে ব্যান্ডিং (Color Banding) বা অতিরিক্ত ফিল্টার ব্যবহারের কারণে আসা ত্রুটিগুলো আমাদের সাবমিশন চেকলিস্টে Pass/Warn/Fail স্ট্যাটাস সহ ধরা পড়ে।",
    solution: "সমাধান: ব্যাকগ্রাউন্ড বা আকাশ কীভাবে ডি-নয়েজ (Noise reduction) করতে হবে এবং dithering-এর মাধ্যমে কালার ট্রানজিশন স্মুথ করার ট্রিকস এখানে পেয়ে যাবেন।",
    tips: [
      "সবসময় সর্বোচ্চ মানের জেপিজি (Quality 10-12, sRGB কালার প্রোফাইল) হিসেবে আপনার ফাইল এক্সপোর্ট করুন।",
      "ফ্ল্যাট সারফেস এবং আকাশে কালার ব্যান্ডিং বা কম্প্রেশন ব্লকস চেক করুন।",
      "কালার গ্রেডিয়েন্ট ট্রানজিশন স্মুথ করতে Dithering বা সামান্য Noise যোগ করুন।"
    ]
  },
  {
    title: "৪. মেটাডেটা এবং কিওয়ার্ড রিজেকশন (Titles & Keywords)",
    rejectionReason: "শনাক্তকরণ: অনেক সময় চমৎকার ছবিও ভুল টাইটেল বা অতিরিক্ত কিওয়ার্ড স্টাফিংয়ের কারণে রিজেক্ট হয়। আমাদের অ্যাপটি অ্যাডোবি স্টকের নিয়ম মেনে কোনোরকম স্প্যাম শব্দ ছাড়া টাইটেল লেখে এবং সবচেয়ে গুরুত্বপূর্ণ কিওয়ার্ডগুলোকে ক্রমানুসারে সাজিয়ে দেয়।",
    solution: "সমাধান: অ্যাপে মেটাডেটা এডিটরটি ব্যবহার করুন। এটি ফিজিক্যাল বা অবজেক্টিভ টাইটেল লিখতে সাহায্য করে এবং অপ্রাসঙ্গিক স্প্যাম শব্দ বা AI ব্র্যান্ড নাম এড়িয়ে চলে।",
    tips: [
      "সাবমিট করার সময় অবশ্যই 'Created using generative AI tools' টিক দিন।",
      "টাইটেলে কখনোই 'AI generated', 'Midjourney', 'Stable Diffusion', '4K', 'masterpiece' ইত্যাদি শব্দ ব্যবহার করবেন না।",
      "সর্বোচ্চ ৫০টি কিওয়ার্ডের মধ্যে আপনার কিওয়ার্ডের সংখ্যা সীমাবদ্ধ রাখুন, ১৫-৩৫ টি কিওয়ার্ড হলো গোল্ডেন সুইটস্পট।"
    ]
  },
  {
    title: "৫. ইন্টেলেকচুয়াল প্রোপার্টি এবং ট্রেডমার্ক (IP & Trademarks)",
    rejectionReason: "শনাক্তকরণ: ছবিতে কোনো দৃশ্যমান লোগো, ব্র্যান্ড নেম, স্বত্বাধিকারী ডিজাইন (যেমন Nike Swoosh, Apple লোগো) বা কোনো স্বত্বাধিকারী স্থাপত্য বা ল্যান্ডমার্ক রয়েছে কি না তা চেক করা হয়।",
    solution: "সমাধান: ক্লোন স্ট্যাম্প, স্পট হিলিং ব্রাশ বা ফটোশপের জেনারেটিভ ফিল ব্যবহার করে সব ধরণের ব্র্যান্ড ট্যাগ, লোগো বা লেখা সম্পূর্ণভাবে মুছে ফেলুন।",
    tips: [
      "রাস্তার সাইনবোর্ড, গাড়ির লাইসেন্স প্লেট বা টেক্সট সাবধানে মুছে দিন।",
      "ল্যাপটপ বা ফোনের ব্র্যান্ড লোগো বা সিগনেচার বাটনগুলো মুছে দিন।"
    ]
  },
  {
    title: "৬. অনুরূপ কন্টেন্ট / স্প্যাম (Similar Content / Spam)",
    rejectionReason: "শনাক্তকরণ: একই প্রম্পটের ২০টি কাছাকাছি মিল থাকা ডিজাইন বা সামান্য পোজ আলাদা কন্টেন্ট আপলোড করলে স্প্যাম হিসেবে ফ্ল্যাগ করা হয়।",
    solution: "সমাধান: কোনো ধারণার সেরা ১-২ টি ভ্যারিয়েশন বা ছবি সাবমিট করুন। প্রতিটির ভিন্ন কম্পোজিশন ও ভ্যালু থাকা আবশ্যক।",
    tips: [
      "একই জেনারেটিভ রানের ডজন ডজন ছবি বাল্ক সাবমিট করবেন না।",
      "নিশ্চিত করুন প্রতিটি সাবমিট করা ফাইল ক্রেতার জন্য ভিন্ন মূল্য সরবরাহ করে।"
    ]
  }
];

export const ADOBE_STOCK_CATEGORIES = [
  "Animals",
  "Buildings and Architecture",
  "Business",
  "Drinks",
  "Environment",
  "States of Mind",
  "Food",
  "Graphic Resources",
  "Hobbies and Leisure",
  "Industry",
  "Landscapes",
  "Lifestyle",
  "People",
  "Plants and Flowers",
  "Culture and Religion",
  "Science",
  "Social Issues",
  "Sports",
  "Technology",
  "Transport",
  "Travel",
  "Other"
];
