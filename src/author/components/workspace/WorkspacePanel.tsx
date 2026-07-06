import type { AuthorTask, AuthorGoal, AuthorAchievement, CalendarEvent } from '../types/workspace.types';

interface WorkspacePanelProps {
  tasks: AuthorTask[];
  goals: AuthorGoal[];
  achievements: AuthorAchievement[];
  calendar: CalendarEvent[];
}

export function WorkspacePanel({ tasks, goals, achievements, calendar }: WorkspacePanelProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section>
        <h4 className="text-xs font-semibold text-gold-400 mb-2">Tasks</h4>
        {tasks.length === 0 ? (
          <p className="text-xs text-gray-500">No tasks.</p>
        ) : (
          <ul className="space-y-1">
            {tasks.slice(0, 5).map((t) => (
              <li key={t.id} className="text-sm text-gray-300 flex justify-between">
                <span>{t.title}</span>
                <span className="text-xs text-gray-500">{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h4 className="text-xs font-semibold text-gold-400 mb-2">Goals</h4>
        {goals.length === 0 ? (
          <p className="text-xs text-gray-500">No goals set.</p>
        ) : (
          <ul className="space-y-1">
            {goals.map((g) => (
              <li key={g.id} className="text-sm text-gray-300">
                {g.title}: {g.currentValue}/{g.targetValue} {g.unit}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h4 className="text-xs font-semibold text-gold-400 mb-2">Achievements</h4>
        <ul className="space-y-1">
          {achievements.map((a) => (
            <li key={a.id} className="text-sm text-gray-300">
              {a.unlockedAt ? '✓' : '○'} {a.title}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h4 className="text-xs font-semibold text-gold-400 mb-2">Publishing Calendar</h4>
        {calendar.length === 0 ? (
          <p className="text-xs text-gray-500">No upcoming events.</p>
        ) : (
          <ul className="space-y-1">
            {calendar.map((e) => (
              <li key={e.id} className="text-sm text-gray-300">
                {new Date(e.eventDate).toLocaleDateString()} — {e.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
