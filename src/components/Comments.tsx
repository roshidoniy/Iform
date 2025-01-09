import { Link } from "react-router";
import { User } from "firebase/auth";
import {useRef} from "react";
import { submitComment } from "../services/firebase-templates";
import { Comment } from "../types/types";

interface CommentsProps {
    templateId: string;
    user: User | null;
    commentsList: Comment[];
}

const Comments = ({ templateId, user, commentsList }: CommentsProps) => {
    const commentRef = useRef<HTMLTextAreaElement>(null)
    async function handleCommentSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(!commentRef.current?.value) return;

        try {
            await submitComment({templateID: templateId, authorEmail: user?.email as string, comment_text: commentRef.current.value});
            commentRef.current.value = "";
        } catch (error) {
            console.error("Error submitting comment:", error);
        }

    }
    return (
        <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments</h2>
            
            {user ? (
                <div className="mb-8">
                    <textarea
                        placeholder="Write a comment..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        ref={commentRef}
                    />
                    <div className="mt-2 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all" onClick={handleCommentSubmit}>
                            Post Comment
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center mb-8">
                    <p className="text-gray-600">
                        Please <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to leave a comment.
                    </p>
                </div>
            )}
            
            <div className="space-y-6">
                {commentsList?.map((comment) => (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">{comment.authorEmail.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-gray-900">{comment.authorEmail}</span>
                        </div>
                        <span className="text-sm text-gray-500">{comment.createdAt.toDate().toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600">{comment.comment_text}</p>
                </div>
                ))}
            </div>
        </div>
    );
};

export default Comments; 