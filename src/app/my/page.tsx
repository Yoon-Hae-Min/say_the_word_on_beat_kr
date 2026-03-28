"use client";

import { ArrowLeft, Eye, Globe, Lock, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { challengeKeys, useMyChallenges, useMyChallengesCount } from "@/entities/challenge";
import { usePagination, useURLSearchParams } from "@/shared/hooks";
import { getUserId } from "@/shared/lib/user/fingerprint";
import { ChalkButton, LoadingState, PaginationControls, WoodFrame } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import { updateChallengePublicStatus } from "@/entities/challenge";

const ITEMS_PER_PAGE = 12;

function MyChallengeCard({
	challenge,
	onDelete,
	onTogglePublic,
}: {
	challenge: {
		id: string;
		title: string;
		thumbnail: string;
		viewCount: number;
		isPublic: boolean;
		difficultyEasy: number;
		difficultyNormal: number;
		difficultyHard: number;
	};
	onDelete: (id: string, title: string) => void;
	onTogglePublic: (id: string, currentStatus: boolean) => void;
}) {
	const router = useRouter();
	const totalVotes = challenge.difficultyEasy + challenge.difficultyNormal + challenge.difficultyHard;

	return (
		<div className="group overflow-hidden rounded-lg bg-chalk-white/5 transition-all hover:bg-chalkboard-bg/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]">
			{/* Thumbnail - clickable to play */}
			<div
				role="button"
				tabIndex={0}
				onClick={() => router.push(`/play/${challenge.id}`)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						router.push(`/play/${challenge.id}`);
					}
				}}
				className="relative aspect-video cursor-pointer overflow-hidden"
			>
				<Image
					src={challenge.thumbnail}
					alt={challenge.title}
					fill
					className="object-cover transition-transform group-hover:scale-105"
					sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>
				{/* Status badge */}
				<div className="absolute left-2 top-2">
					{challenge.isPublic ? (
						<Badge variant="secondary" className="bg-chalk-blue/90 text-chalkboard-bg">
							<Globe size={12} className="mr-1" />
							공개
						</Badge>
					) : (
						<Badge variant="secondary" className="bg-chalk-white/90 text-chalkboard-bg">
							<Lock size={12} className="mr-1" />
							비공개
						</Badge>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				<h3 className="chalk-text mb-3 line-clamp-1 text-lg text-chalk-white">{challenge.title}</h3>

				{/* Stats */}
				<div className="mb-4 flex items-center gap-4 text-sm text-chalk-white/60">
					<span className="flex items-center gap-1">
						<Eye size={14} />
						조회 {challenge.viewCount}
					</span>
					{totalVotes > 0 && (
						<span>투표 {totalVotes}</span>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => onTogglePublic(challenge.id, challenge.isPublic)}
						className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 px-3 py-2 text-sm transition-all hover:scale-[1.02] ${
							challenge.isPublic
								? "border-chalk-white/40 text-chalk-white hover:bg-chalk-white/10"
								: "border-chalk-yellow/60 text-chalk-yellow hover:bg-chalk-yellow/10"
						}`}
					>
						{challenge.isPublic ? (
							<>
								<Lock size={14} />
								<span className="chalk-text">비공개로</span>
							</>
						) : (
							<>
								<Globe size={14} />
								<span className="chalk-text">공개하기</span>
							</>
						)}
					</button>
					<button
						type="button"
						onClick={() => onDelete(challenge.id, challenge.title)}
						className="flex items-center justify-center rounded-lg border-2 border-danger/40 px-3 py-2 text-danger transition-all hover:scale-[1.02] hover:bg-danger/10"
						aria-label="삭제"
					>
						<Trash2 size={14} />
					</button>
				</div>
			</div>
		</div>
	);
}

function MyPageContent() {
	const router = useRouter();
	const userId = getUserId();

	const urlParams = useURLSearchParams({
		defaults: { page: "1" },
		basePath: "/my",
	});

	const currentPage = Number(urlParams.get("page"));
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	const { data: challenges = [], isLoading } = useMyChallenges(userId, ITEMS_PER_PAGE, offset, "latest");
	const { data: totalCount = 0 } = useMyChallengesCount(userId);

	const pagination = usePagination({
		totalCount,
		itemsPerPage: ITEMS_PER_PAGE,
		initialPage: currentPage,
		onPageChange: (page) => {
			urlParams.set({ page: page.toString() });
		},
	});

	const queryClient = useQueryClient();

	// Delete state
	const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Optimistic delete
	const handleDelete = async (challengeId: string) => {
		setIsDeleting(true);

		// Snapshot for rollback
		const queryKey = challengeKeys.mine(userId, { limit: ITEMS_PER_PAGE, offset, sortBy: "latest" });
		const previousData = queryClient.getQueryData(queryKey);

		// Optimistic: remove from UI immediately
		queryClient.setQueryData(queryKey, (old: typeof challenges | undefined) =>
			old ? old.filter((c) => c.id !== challengeId) : []
		);
		setDeleteTarget(null);

		try {
			const response = await fetch(`/api/admin/challenges/${challengeId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			});

			if (!response.ok) throw new Error("삭제에 실패했습니다.");

			// Invalidate to sync with server
			queryClient.invalidateQueries({ queryKey: challengeKeys.all });
		} catch {
			// Rollback on error
			queryClient.setQueryData(queryKey, previousData);
			alert("삭제에 실패했습니다. 다시 시도해주세요.");
		} finally {
			setIsDeleting(false);
		}
	};

	// Optimistic toggle public/private
	const handleTogglePublic = async (challengeId: string, currentStatus: boolean) => {
		const queryKey = challengeKeys.mine(userId, { limit: ITEMS_PER_PAGE, offset, sortBy: "latest" });
		const previousData = queryClient.getQueryData(queryKey);

		// Optimistic: toggle in UI immediately
		queryClient.setQueryData(queryKey, (old: typeof challenges | undefined) =>
			old
				? old.map((c) => (c.id === challengeId ? { ...c, isPublic: !currentStatus } : c))
				: []
		);

		try {
			await updateChallengePublicStatus(challengeId, userId, !currentStatus);
			queryClient.invalidateQueries({ queryKey: challengeKeys.all });
		} catch {
			// Rollback on error
			queryClient.setQueryData(queryKey, previousData);
			alert("변경에 실패했습니다. 다시 시도해주세요.");
		}
	};

	const publicCount = challenges.filter((c) => c.isPublic).length;
	const privateCount = challenges.filter((c) => !c.isPublic).length;

	return (
		<WoodFrame>
			<main className="min-h-screen bg-chalkboard-bg px-4 py-8 md:py-16">
				<div className="mx-auto max-w-6xl">
					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<button
							type="button"
							onClick={() => router.push("/challenges")}
							className="flex items-center gap-2 text-chalk-white transition-colors hover:text-chalk-yellow"
						>
							<ArrowLeft size={24} />
							<span className="chalk-text text-lg md:text-xl">챌린지 목록</span>
						</button>
						{totalCount > 0 && (
							<ChalkButton variant="yellow" onClick={() => router.push("/maker")}>
								<Plus size={16} />
								새로 만들기
							</ChalkButton>
						)}
					</div>

					{/* Title + Stats */}
					<h1 className="chalk-text mb-4 text-center text-3xl font-bold text-chalk-white md:text-5xl">
						내 챌린지
					</h1>
					{totalCount > 0 && (
						<div className="mb-12 flex items-center justify-center gap-4 text-chalk-white/60">
							<span>총 {totalCount}개</span>
							<span>·</span>
							<span className="flex items-center gap-1">
								<Globe size={14} />
								공개 {publicCount}
							</span>
							<span className="flex items-center gap-1">
								<Lock size={14} />
								비공개 {privateCount}
							</span>
						</div>
					)}

					{/* Loading */}
					{isLoading && <LoadingState />}

					{/* Empty state */}
					{!isLoading && challenges.length === 0 && (
						<div className="flex flex-col items-center gap-6 py-20">
							<p className="chalk-text text-lg text-chalk-white/60">아직 만든 챌린지가 없어요</p>
							<p className="text-sm text-chalk-white/40">이미지만 올리면 1분 안에 완성!</p>
							<ChalkButton variant="white-outline" onClick={() => router.push("/maker")}>
								첫 챌린지 만들기
							</ChalkButton>
						</div>
					)}

					{/* Challenge grid */}
					{!isLoading && challenges.length > 0 && (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{challenges.map((challenge, index) => (
								<div
									key={challenge.id}
									className="animate-fade-in"
									style={{
										animationDelay: `${index * 50}ms`,
										animationFillMode: "backwards",
									}}
								>
									<MyChallengeCard
										challenge={challenge}
										onDelete={(id, title) => setDeleteTarget({ id, title })}
										onTogglePublic={handleTogglePublic}
									/>
								</div>
							))}
						</div>
					)}

					{/* Pagination */}
					{challenges.length > 0 && (
						<PaginationControls
							currentPage={currentPage}
							totalPages={pagination.totalPages}
							hasPrevious={pagination.hasPrevious}
							hasNext={pagination.hasNext}
							onPrevious={pagination.handlers.goToPrevious}
							onNext={pagination.handlers.goToNext}
							onPageClick={pagination.handlers.goToPage}
							className="mt-12"
						/>
					)}
				</div>
			</main>

			{/* Delete confirm modal */}
			{deleteTarget && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						role="button"
						tabIndex={-1}
						className="absolute inset-0 bg-black/50"
						onClick={() => !isDeleting && setDeleteTarget(null)}
						onKeyDown={(e) => e.key === "Escape" && !isDeleting && setDeleteTarget(null)}
						aria-label="모달 닫기"
					/>
					<div className="relative z-10 w-full max-w-md animate-fade-in rounded-lg bg-chalkboard-bg p-8 shadow-2xl">
						<button
							type="button"
							onClick={() => setDeleteTarget(null)}
							disabled={isDeleting}
							className="absolute right-4 top-4 text-chalk-white transition-colors hover:text-chalk-yellow disabled:opacity-50"
						>
							<X size={24} />
						</button>
						<h2 className="chalk-text mb-4 text-2xl font-bold text-chalk-yellow">챌린지 삭제</h2>
						<div className="mb-6 space-y-3">
							<p className="text-lg text-chalk-white">정말 삭제하시겠습니까?</p>
							<p className="text-sm text-chalk-white/70">"{deleteTarget.title}"</p>
							<p className="text-sm text-chalk-white/70">삭제된 챌린지는 복구할 수 없습니다.</p>
						</div>
						<div className="flex gap-3">
							<ChalkButton variant="white" onClick={() => setDeleteTarget(null)} disabled={isDeleting} className="flex-1">
								취소
							</ChalkButton>
							<ChalkButton
								variant="yellow"
								onClick={() => handleDelete(deleteTarget.id)}
								disabled={isDeleting}
								className="flex-1"
							>
								{isDeleting ? "삭제 중..." : "삭제"}
							</ChalkButton>
						</div>
					</div>
				</div>
			)}
		</WoodFrame>
	);
}

export default function MyPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<MyPageContent />
		</Suspense>
	);
}
