import { axiosInstance, authAxiosInstance } from "./AxiosInstans";

export async function getPresignedUrl(input = {}, opts = { auth: true }) {
    const {
        file_name,
        file_type = "application/octet-stream",
        folder = "",
        s3_key,
        operation = "download",
    } = input;

    const payload = s3_key
        ? { operation, s3_key, file_type }
        : { operation, folder, file_name, file_type };

    const client = opts?.auth ? authAxiosInstance : axiosInstance;

    try {
        const res = await client.post("/get_presigned_url/", payload);
        const wrapped = res?.data?.data ?? res?.data ?? {};
        return wrapped;
    } catch (err) {
        const msg =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to get presigned URL";
        console.error("getPresignedUrl error:", err);
        throw new Error(msg);
    }
}

const usePresignedUrl = () => {
    const fetchPresignedUrl = async (data, opts) => {
        const resp = await getPresignedUrl(data, opts);
        return {
            presigned_url: resp?.presigned_url || resp?.download_url,
            file_type: data?.file_type,
            ...resp,
        };
    };
    return { fetchPresignedUrl };
};

export default usePresignedUrl;
