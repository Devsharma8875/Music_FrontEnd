const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
// const secondaryServer = import.meta.env.VITE_SERVER_DOWNLOAD_BASE_URL;

// export const getAudioUrls = async ({ id }) => {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

//   try {
//     const primaryServerRes = await fetch(`${baseUrl}/song/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     if (!primaryServerRes.ok) {
//       throw new Error(`Primary server error: ${primaryServerRes.status}`);
//     }

//     const data = await primaryServerRes.json();
//     return data;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     console.error("Primary server failed:", error.message || error);

//     try {
//       const secondaryServerRes = await fetch(`${secondaryServer}/song/${id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!secondaryServerRes.ok) {
//         throw new Error(`Secondary server error: ${secondaryServerRes.status}`);
//       }

//       const fallbackData = await secondaryServerRes.json();
//       return fallbackData;
//     } catch (secondaryError) {
//       console.error(
//         "Secondary server failed:",
//         secondaryError.message || secondaryError
//       );
//       throw new Error("Both servers failed to respond properly.");
//     }
//   }
// };

export const getAudioUrls = async ({ id }) => {
  try {
    const response = await fetch(`${baseUrl}/song/${id}`);

    console.log("Response", response);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received data:", data);

    return {
      audioFormatHigh: data.formats.high,
      audioFormatLow: data.formats.low,
    };
  } catch (error) {
    console.error("Failed to get audio URLs:", error);
    throw error;
  }
};
