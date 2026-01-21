"use client";

import { apiFetch } from "@/lib/api";

export default function VoteButtons({
    postId,
    points,
}: {
    postId: number;
    points: number;
}) {
    async function vote(value: number) {
        await apiFetch(`/posts/${postId}/vote?value=${value}`, {
            method: "POST",
        });
        location.reload();
    }

    return (
        <div>
            <button onClick={() => vote(1)}>▲</button>
            <div>{points}</div>
            <button onClick={() => vote(-1)}>▼</button>
        </div>
    );
}
