import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShell } from "../lib/shell-context";
import { CreateProjectFlow } from "./CreateProjectFlow";
import { GitHubOnboardingNotice } from "./GitHubOnboardingNotice";
import { TopbarButton } from "./TopbarButton";
import { WelcomePanel } from "./WelcomePanel";
import { OrchestratorIcon } from "./icons";

// Board empty states: first-launch welcome (`BoardWelcome`) and a fresh
// project that still needs a first task (`ProjectBoardEmpty`).
export function BoardWelcome() {
	const { cloneProject, createProject, initializeProjectRepository } = useShell();
	return (
		<WelcomePanel>
			<div
				className="flex h-full min-h-0 items-center justify-center overflow-y-auto px-6 py-8"
				data-testid="board-welcome"
			>
				<div className="flex w-full flex-col items-center gap-3">
					<CreateProjectFlow
						embedded
						mode="choose"
						onCloneProject={cloneProject}
						onCreateProject={createProject}
						onInitializeProject={initializeProjectRepository}
					/>
					<GitHubOnboardingNotice />
				</div>
			</div>
		</WelcomePanel>
	);
}

// Project board with a registered project but no tasks yet: confirm setup
// succeeded, explain the next step, and invite work instead of four empty
// columns. Actions mirror the board header (Orchestrator stays the primary,
// like the topbar) so the vocabulary holds.
export function ProjectBoardEmpty({
	hasOrchestrator,
	isProjectRestarting,
	isSpawning,
	onNewTask,
	onOpenOrchestrator,
	onOpenOrchestratorAsTui,
	spawnError,
}: {
	hasOrchestrator: boolean;
	isProjectRestarting: boolean;
	isSpawning: boolean;
	onNewTask: () => void;
	onOpenOrchestrator: () => void;
	onOpenOrchestratorAsTui?: () => void;
	spawnError?: string | null;
}) {
	const { t } = useTranslation();
	const orchestratorLabel = hasOrchestrator ? t("shell.orchestrator") : t("shell.spawnOrchestrator");
	const busyLabel = isProjectRestarting
		? t("shell.restartingDots")
		: isSpawning
			? t("shell.spawningDots")
			: orchestratorLabel;

	return (
		<div className="flex h-full min-h-0 items-center justify-center overflow-y-auto">
			<div className="flex w-full max-w-preview-content flex-col items-center pb-empty-offset-y text-center">
				<h2 className="text-subtitle font-semibold tracking-tight text-foreground">{t("board.empty.title")}</h2>
				<p className="mt-2 text-md-sm leading-relaxed text-muted-foreground">{t("board.empty.body")}</p>
				<p className="mt-3 text-caption font-medium tracking-wide text-muted-foreground">{t("board.empty.workflow")}</p>
				<div className="mt-5 flex items-start justify-center gap-3">
					<div className="flex flex-col items-center gap-1.5">
						<TopbarButton
							aria-label={orchestratorLabel}
							disabled={isSpawning || isProjectRestarting}
							onClick={onOpenOrchestrator}
							variant="primary"
						>
							<OrchestratorIcon className="size-icon-md" aria-hidden="true" />
							{busyLabel}
						</TopbarButton>
						<p className="max-w-44 text-caption leading-body text-muted-foreground">{t("board.empty.orchestratorHint")}</p>
					</div>
					<div className="flex flex-col items-center gap-1.5">
						<TopbarButton aria-label={t("shell.newTask")} disabled={isProjectRestarting} onClick={onNewTask} variant="accent">
							<Plus className="size-icon-md" aria-hidden="true" />
							{t("shell.newTask")}
						</TopbarButton>
						<p className="max-w-44 text-caption leading-body text-muted-foreground">{t("board.empty.newTaskHint")}</p>
					</div>
				</div>
				{spawnError && (
					<div className="mt-3 flex flex-col items-center gap-2">
						<p className="text-caption leading-body text-error" role="status">
							{spawnError}
						</p>
						{onOpenOrchestratorAsTui ? (
							<TopbarButton disabled={isSpawning || isProjectRestarting} onClick={onOpenOrchestratorAsTui}>
								{t("newTask.createAsTui")}
							</TopbarButton>
						) : null}
					</div>
				)}
			</div>
		</div>
	);
}
