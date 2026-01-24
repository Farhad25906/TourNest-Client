/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag, revalidatePath } from "next/cache";

export interface IDestination {
    id?: string;
    name: string;
    image: string;
    description?: string;
    isFeatured?: boolean;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    meta?: any;
}

export const getAllDestinations = async (params: { searchTerm?: string; isFeatured?: boolean } = {}): Promise<ApiResponse<IDestination[]>> => {
    try {
        const query = new URLSearchParams();
        if (params.searchTerm) query.append("searchTerm", params.searchTerm);
        if (params.isFeatured !== undefined) query.append("isFeatured", params.isFeatured.toString());

        const res = await serverFetch.get(`/destinations?${query.toString()}`, {
            next: { tags: ["destinations"] },
        } as any);

        const result = await res.json();
        return result;
    } catch (error: any) {
        console.error("Error fetching destinations:", error);
        return {
            success: false,
            message: "Failed to fetch orbital data",
            data: []
        };
    }
};

export const createDestination = async (formData: FormData): Promise<ApiResponse<IDestination>> => {
    try {
        const res = await serverFetch.post("/destinations", {
            body: formData,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        });

        const result = await res.json();
        if (result.success) {
            revalidateTag("destinations", { expire: 0 } as any);
            revalidatePath("/admin/dashboard/destinations-management");
        }
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: "Failed to initialize mapping"
        };
    }
};

export const updateDestination = async (id: string, formData: FormData): Promise<ApiResponse<IDestination>> => {
    try {
        const res = await serverFetch.patch(`/destinations/${id}`, {
            body: formData,
            // Don't set Content-Type - browser will set it with boundary for multipart/form-data
        });

        const result = await res.json();
        if (result.success) {
            revalidateTag("destinations", { expire: 0 } as any);
            revalidatePath("/admin/dashboard/destinations-management");
        }
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: "Failed to optimize sector"
        };
    }
};

export const deleteDestination = async (id: string): Promise<ApiResponse> => {
    try {
        const res = await serverFetch.delete(`/destinations/${id}`);
        const result = await res.json();
        if (result.success) {
            revalidateTag("destinations", { expire: 0 } as any);
            revalidatePath("/admin/dashboard/destinations-management");
        }
        return result;
    } catch (error: any) {
        return {
            success: false,
            message: "Failed to redact record"
        };
    }
};
