import React, { useEffect, useRef, useState } from 'react';
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Select,
  Tag,
  Tooltip,
  Popconfirm,
  Modal,
} from 'antd';
import { ChevronDown, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import { useModal } from '@/hooks/useModal';
import TaskForm from './TaskForm';
import { useAppDispatch } from '@/hooks/use-redux';

type User = {
  id: number;
  name: string;
  avatar: string;
};

type Task = {
  id: number | string;
  name: string;
  assignees: User[];
  status: string;
  due_date: string | null;
  priority: string;
  subtasks?: Task[];
  isNew?: boolean;
  parentId?: number;
};

const AutoSaveTable = () => {
  const dispatch = useAppDispatch();
  const { Option } = Select;
  const users: User[] = [
    {
      id: 1,
      name: 'Niruja Antonyrasan',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      id: 2,
      name: 'Vairamuththu Vithushan',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    {
      id: 3,
      name: 'Jegatheesar',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 4,
      name: 'shanmugi',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 5,
      name: 'raji',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 6,
      name: 'anthony joseph',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 7,
      name: 'Luxsan rasan',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 8,
      name: 'Emma watson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  ];

  const sampleTasks: Task[] = [
    {
      id: 1,
      name: 'VMS Feature List',
      assignees: [
        users[0],
        users[1],
        users[2],
        users[3],
        users[4],
        users[5],
        users[6],
        users[7],
      ],
      status: 'NEW',
      due_date: null,
      priority: 'Medium',
      subtasks: [
        {
          id: 11,
          name: 'UI Design for VMS',
          assignees: [users[0]],
          status: 'INPROGRESS',
          due_date: '2025-11-01',
          priority: 'High',
          subtasks: [],
        },
        {
          id: 12,
          name: 'API Integration',
          assignees: [users[1]],
          status: 'NEW',
          due_date: null,
          priority: 'Medium',
          subtasks: [
            {
              id: 121,
              name: 'Auth API Integration',
              assignees: [users[2]],
              status: 'INPROGRESS',
              due_date: '2025-11-08',
              priority: 'Urgent',
              subtasks: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'API Testing',
      assignees: [users[2]],
      status: 'INPROGRESS',
      due_date: '2025-11-08',
      priority: 'Urgent',
      subtasks: [
        {
          id: 21,
          name: 'API Testing',
          assignees: [users[2]],
          status: 'INPROGRESS',
          due_date: '2025-11-08',
          priority: 'Urgent',
          subtasks: [],
        },
      ],
    },
  ];

  const statusOptions = [
    {
      value: 'NEW',
      label: 'NEW',
      color: '#FFC107',
      bg: 'bg-yellow-200',
    },
    {
      value: 'PENDING',
      label: 'PENDING',
      color: '#FF69B4',
      bg: 'bg-pink-500',
    },
    {
      value: 'INPROGRESS',
      label: 'IN PROGRESS',
      color: '#FF8C00',
      bg: 'bg-orange-400',
    },
    {
      value: 'COMPLETED',
      label: 'COMPLETED',
      color: '#2E7D32',
      bg: 'bg-green-800',
    },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low', color: '#4CAF50', bg: 'bg-green-500' },
    { value: 'Medium', label: 'Medium', color: '#FFC107', bg: 'bg-yellow-400' },
    { value: 'High', label: 'High', color: '#FF9800', bg: 'bg-orange-400' },
    { value: 'Urgent', label: 'Urgent', color: '#F44336', bg: 'bg-red-500' },
  ];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number | string>>(
    new Set(),
  );
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  const [newSubtask, setNewSubtask] = useState<{
    parentId: number;
    name: string;
    assignees: User[];
    status: string;
    due_date: string | null;
    priority: string;
  } | null>(null);

  const {
    isOpen: isTaskModalOpen,
    openModal: openTaskModal,
    closeModal: closeTaskModal,
  } = useModal(false);

  const taskFormRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const handleCloseTaskModal = () => {
    closeTaskModal();
    taskFormRef.current?.resetForm?.();
  };

  const handleTaskSubmit = async (values: any) => {
    // try {
    //   console.log('New Workspace Payload:', values);
    //   await dispatch(
    //     createTask({
    //       ...values,
    //       organizationId: organization?.id,
    //     }),
    //   ).unwrap();
    //   dispatch(
    //     getAllWorkspaces({
    //       organizationId: organization.id,
    //     }),
    //   );
    //   toast.success('Workspace created successfully!');
    //   handleCloseWorkspaceModal();
    // } catch (error: any) {
    //   console.error('Workspace creation failed:', error);
    //   toast.error(
    //     error?.message || 'Failed to create workspace. Please try again.',
    //   );
    // }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTasks(sampleTasks);
      setLoading(false);
    }, 800);
  }, []);

  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  let timer: any;
  const handleAutoSave = (id: number | string, field: string, value: any) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        console.log(`Auto-saved Task ID: ${id} | ${field}: ${value}`);
        if (typeof id === 'number') {
          // await axios.patch(`/api/tasks/${id}`, { [field]: value });
          showMessage('success', 'Task auto-saved');
        }
      } catch (err) {
        showMessage('error', 'Failed to auto-save');
      }
    }, 600);
  };

  const updateTaskRecursively = (
    list: Task[],
    id: number | string,
    field: string,
    value: any,
  ): Task[] =>
    list.map((task) => {
      if (task.id === id) return { ...task, [field]: value };
      if (task.subtasks?.length) {
        return {
          ...task,
          subtasks: updateTaskRecursively(task.subtasks, id, field, value),
        };
      }
      return task;
    });

  const handleChange = (id: number | string, field: string, value: any) => {
    const updated = updateTaskRecursively(tasks, id, field, value);
    setTasks(updated);
    handleAutoSave(id, field, value);
  };

  const deleteTaskRecursively = (list: Task[], id: number | string): Task[] => {
    return list
      .filter((task) => task.id !== id)
      .map((task) => {
        if (task.subtasks?.length) {
          return {
            ...task,
            subtasks: deleteTaskRecursively(task.subtasks, id),
          };
        }
        return task;
      });
  };

  const handleDeleteTask = (id: number | string) => {
    const updated = deleteTaskRecursively(tasks, id);
    setTasks(updated);
    showMessage('success', 'Task deleted successfully');
  };

  const handleAddSubtask = (parentId: number) => {
    setNewSubtask({
      parentId,
      name: '',
      assignees: [],
      status: 'NEW',
      due_date: null,
      priority: 'Medium',
    });

    // Expand the parent row
    setExpandedRows((prev) => new Set(prev).add(parentId));

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSaveSubtask = () => {
    if (!newSubtask?.name?.trim()) {
      showMessage('warning', 'Subtask name is required');
      return;
    }

    const addSubtaskRecursively = (list: Task[]): Task[] =>
      list.map((task) => {
        if (task.id === newSubtask.parentId) {
          const newSub: Task = {
            id: Date.now(),
            name: newSubtask.name,
            assignees: newSubtask.assignees,
            status: newSubtask.status,
            due_date: newSubtask.due_date,
            priority: newSubtask.priority,
            subtasks: [],
          };
          console.log('subtask', newSub);

          return { ...task, subtasks: [...(task.subtasks || []), newSub] };
        }
        if (task.subtasks?.length) {
          return { ...task, subtasks: addSubtaskRecursively(task.subtasks) };
        }
        return task;
      });

    const updated = addSubtaskRecursively(tasks);
    setTasks(updated);
    showMessage('success', 'Subtask added');

    // Keep the same parent and open a new subtask row
    const currentParentId = newSubtask.parentId;
    setNewSubtask({
      parentId: currentParentId,
      name: '',
      assignees: [],
      status: 'NEW',
      due_date: null,
      priority: 'Medium',
    });

    setOpenDropdown(null);

    // Focus on the new input field
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCancelSubtask = () => {
    setNewSubtask(null);
    setOpenDropdown(null);
  };

  const handleClickOutside = (e: any) => {
    if (
      newSubtask &&
      !e.target.closest('.new-subtask-row') &&
      !e.target.closest('.ant-picker-dropdown') &&
      !e.target.closest('.ant-select-dropdown')
    ) {
      setNewSubtask(null);
    }
  };

  useEffect(() => {
    if (newSubtask) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [newSubtask]);

  useEffect(() => {
    const handleClickOutsideDropdown = (e: MouseEvent) => {
      const dropdownElements = document.querySelectorAll('.assignee-dropdown');
      let clickedInside = false;
      dropdownElements.forEach((el) => {
        if (el.contains(e.target as Node)) clickedInside = true;
      });

      if (!clickedInside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
  }, []);

  const toggleExpand = (id: number | string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderTaskRow = (task: Task, level: number = 0) => {
    const isExpanded = expandedRows.has(task.id);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const shouldShowExpander =
      hasSubtasks || (newSubtask && newSubtask.parentId === task.id);
    const isHovered = hoveredTaskId === task.id;

    return (
      <React.Fragment key={task.id}>
        <tr className="border-b border-gray-200 hover:bg-gray-50">
          <td
            className="p-3 py-2"
            style={{ paddingLeft: `${level * 24 + 12}px` }}
          >
            <div
              className="flex items-center gap-2 group"
              onMouseEnter={() =>
                typeof task.id === 'number' &&
                setHoveredTaskId(task.id as number)
              }
              onMouseLeave={() => setHoveredTaskId(null)}
            >
              {/* Expand/Collapse Icon */}
              {shouldShowExpander && (
                <button
                  onClick={() => toggleExpand(task.id)}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}

              {/* Input Field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) =>
                    handleChange(task.id, 'name', e.target.value)
                  }
                  className="w-full px-2 py-1 rounded border-transparent hover:border hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-all"
                  style={{ minWidth: '200px' }}
                />
              </div>

              {/* Add Subtask Button (outside input) */}
              {isHovered && typeof task.id === 'number' && (
                <Tooltip title="Add Subtask">
                  <button
                    onClick={() => handleAddSubtask(task.id as number)}
                    className="w-7 h-7 flex items-center justify-center text-blue-500 hover:bg-blue-100 rounded-full transition-all"
                  >
                    <PlusOutlined />
                  </button>
                </Tooltip>
              )}
            </div>
          </td>

          <td className="p-3 py-2">
            <div className="relative">
              <div
                className="flex items-center gap-1 border border-gray-200 rounded px-2 py-1 cursor-pointer flex-wrap min-h-[32px]"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(
                    openDropdown === `task-${task.id}`
                      ? null
                      : `task-${task.id}`,
                  );
                }}
              >
                {task.assignees?.slice(0, 5).map((user) => (
                  <div key={user.id}>
                    <Tooltip title={user.name}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    </Tooltip>
                  </div>
                ))}

                {task.assignees?.length > 5 && (
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                    +{task.assignees?.length - 5}
                  </div>
                )}

                {task.assignees?.length === 0 && (
                  <span className="text-gray-400 text-sm">
                    Select assignees
                  </span>
                )}
              </div>

              {openDropdown === `task-${task.id}` && (
                <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow z-20 max-h-48 overflow-y-auto assignee-dropdown">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const alreadySelected = task.assignees?.find(
                          (u) => u.id === user.id,
                        );
                        const updatedAssignees = alreadySelected
                          ? task.assignees?.filter((u) => u.id !== user.id)
                          : [...task.assignees, user];
                        handleChange(task.id, 'assignees', updatedAssignees);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.assignees?.some((u) => u.id === user.id)}
                        readOnly
                        className="w-4 h-4"
                      />
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span
                        className="text-sm truncate max-w-[120px] text-gray-700"
                        title={user.name}
                      >
                        {user.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </td>

          {/* Status */}
          <td className=" py-2">
            <Select
              value={task.status}
              onChange={(value) => handleChange(task.id, 'status', value)}
              className="w-full rounded-md"
              popupMatchSelectWidth={false}
              variant="borderless"
              onClick={(e) => e.stopPropagation()}
            >
              {statusOptions.map((status) => (
                <Option key={status.value} value={status.value}>
                  <Tag
                    color={status.color}
                    className={`px-3 py-1 rounded-md text-white border-none ${status.bg}`}
                  >
                    {status.label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </td>

          {/* Due Date */}
          <td className="p-3 py-2">
            <DatePicker
              value={task.due_date ? dayjs(task.due_date) : null}
              onChange={(date, dateString) =>
                handleChange(task.id, 'due_date', dateString || null)
              }
              format="YYYY-MM-DD"
              className="w-full px-2 py-1 rounded"
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
              onClick={(e) => e.stopPropagation()}
            />
          </td>

          {/* Priority */}
          <td className="py-2  max-w-[100px]">
            <Select
              value={task.priority}
              onChange={(value) => handleChange(task.id, 'priority', value)}
              className="w-full rounded-md"
              popupMatchSelectWidth={false}
              variant="borderless"
              onClick={(e) => e.stopPropagation()}
            >
              {priorityOptions.map((priority) => (
                <Option key={priority.value} value={priority.value}>
                  <Tag
                    color={priority.color}
                    className={`px-3 py-1 rounded-md text-white border-none ${priority.bg}`}
                  >
                    {priority.label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </td>

          {/* Action Column */}
          <td className="py-2 max-w-[10px]">
            <div className="flex items-center justify-center">
              <Popconfirm
                title="Delete Task"
                description="Are you sure you want to delete this task?"
                onConfirm={() => handleDeleteTask(task.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete Task">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    className="flex items-center justify-center"
                  />
                </Tooltip>
              </Popconfirm>
            </div>
          </td>
        </tr>

        {isExpanded && (
          <>
            {hasSubtasks &&
              task.subtasks!.map((subtask) =>
                renderTaskRow(subtask, level + 1),
              )}
            {newSubtask && newSubtask.parentId === task.id && (
              <tr className="border-b border-gray-200 bg-blue-50 new-subtask-row">
                {/* Subtask Name */}
                <td
                  className="p-3 py-2"
                  style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter subtask name"
                    value={newSubtask.name}
                    onChange={(e) =>
                      setNewSubtask((s) =>
                        s ? { ...s, name: e.target.value } : s,
                      )
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveSubtask();
                      }
                    }}
                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                {/* Subtask Assignees */}
                <td className="p-3 py-2">
                  <div className="relative">
                    <div
                      className="flex items-center gap-1 border border-blue-300 rounded px-2 py-1 cursor-pointer flex-wrap bg-white min-h-[32px]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === 'new-subtask' ? null : 'new-subtask',
                        );
                      }}
                    >
                      {newSubtask.assignees?.slice(0, 5).map((user) => (
                        <div key={user.id}>
                          <Tooltip title={user.name}>
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          </Tooltip>
                        </div>
                      ))}

                      {newSubtask.assignees?.length > 5 && (
                        <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                          +{newSubtask.assignees?.length - 5}
                        </div>
                      )}

                      {(!newSubtask.assignees ||
                        newSubtask.assignees.length === 0) && (
                        <span className="text-gray-400 text-sm">
                          Select assignees
                        </span>
                      )}
                    </div>

                    {openDropdown === 'new-subtask' && (
                      <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded shadow z-20 max-h-48 overflow-y-auto assignee-dropdown">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              const alreadySelected =
                                newSubtask.assignees?.find(
                                  (u) => u.id === user.id,
                                );
                              const updatedAssignees = alreadySelected
                                ? newSubtask.assignees?.filter(
                                    (u) => u.id !== user.id,
                                  )
                                : [...(newSubtask.assignees || []), user];
                              setNewSubtask((s) =>
                                s ? { ...s, assignees: updatedAssignees } : s,
                              );
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={newSubtask.assignees?.some(
                                (u) => u.id === user.id,
                              )}
                              readOnly
                              className="w-4 h-4"
                            />
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span
                              className="text-sm truncate max-w-[120px] text-gray-700"
                              title={user.name}
                            >
                              {user.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* Subtask Status */}
                <td className=" py-2">
                  <Select
                    value={newSubtask?.status}
                    onChange={(value) =>
                      setNewSubtask((s) => (s ? { ...s, status: value } : s))
                    }
                    className="w-full rounded-md"
                    popupMatchSelectWidth={false}
                    variant="borderless"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {statusOptions.map((status) => (
                      <Option key={status.value} value={status.value}>
                        <Tag
                          color={status.color}
                          className={`px-3 py-1 rounded-md text-white border-none ${status.bg}`}
                        >
                          {status.label}
                        </Tag>
                      </Option>
                    ))}
                  </Select>
                </td>

                {/* Subtask Due Date */}
                <td className="p-3 py-2">
                  <DatePicker
                    value={
                      newSubtask?.due_date ? dayjs(newSubtask.due_date) : null
                    }
                    onChange={(date, dateString) => {
                      const normalized = Array.isArray(dateString)
                        ? dateString[0] ?? null
                        : dateString ?? null;
                      setNewSubtask((s) =>
                        s ? { ...s, due_date: normalized } : s,
                      );
                    }}
                    format="YYYY-MM-DD"
                    className="w-full px-2 py-1 rounded"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf('day')
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                {/* Subtask Priority */}
                <td className="py-2 max-w-[120px]">
                  <Select
                    value={newSubtask?.priority}
                    onChange={(value) =>
                      setNewSubtask((s) => (s ? { ...s, priority: value } : s))
                    }
                    className="w-full rounded-md"
                    popupMatchSelectWidth={false}
                    variant="borderless"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {priorityOptions.map((priority) => (
                      <Option key={priority.value} value={priority.value}>
                        <Tag
                          color={priority.color}
                          className={`px-3 py-1 rounded-md text-white border-none ${priority.bg}`}
                        >
                          {priority.label}
                        </Tag>
                      </Option>
                    ))}
                  </Select>
                </td>

                {/* Action Buttons */}
                <td className="p-3 py-2 max-w-[10px]">
                  <div className="flex items-center justify-center gap-1">
                    <Tooltip title="Cancel (Esc)">
                      <Button
                        onClick={handleCancelSubtask}
                        danger
                        icon={<CloseOutlined />}
                        size="small"
                      />
                    </Tooltip>
                    <Tooltip title="Save (Enter)">
                      <Button
                        type="primary"
                        onClick={handleSaveSubtask}
                        icon={<CheckOutlined />}
                        size="small"
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            )}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Message notification */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
            message.type === 'success'
              ? 'bg-green-500 text-white'
              : message.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-yellow-500 text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header section with Add Task button */}
      <div className="flex items-center justify-end mb-3">
        {/* <h2 className="text-xl font-semibold text-gray-800">Task Management</h2> */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openTaskModal();
          }}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          <PlusOutlined />
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
        <div className="overflow-x-auto">
          <div className="min-h-[400px] max-h-[500px] overflow-y-auto">
            <table className="w-full border border-gray-200 border-collapse bg-white">
              <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-left font-semibold text-gray-700">
                    Task Name
                  </th>
                  <th className="p-2 text-left font-semibold text-gray-700">
                    Assignee
                  </th>
                  <th className="p-2 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="p-2 text-left font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className=" p-2 text-left font-semibold text-gray-700 max-w-[120px]">
                    Priority
                  </th>
                  <th className="p-2 text-left font-semibold text-gray-700 max-w-[80px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      Loading tasks...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      No tasks available
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => renderTaskRow(task))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={isTaskModalOpen}
        onCancel={handleCloseTaskModal}
        footer={null}
        title="Create Task"
      >
        <TaskForm
          ref={taskFormRef}
          onSubmit={handleTaskSubmit}
          onFinishModalClose={handleCloseTaskModal}
        />
      </Modal>
    </div>
  );
};

export default AutoSaveTable;
