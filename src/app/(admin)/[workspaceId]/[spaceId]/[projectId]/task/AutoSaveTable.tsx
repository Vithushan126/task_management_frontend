'use client';

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
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { Task, User } from '@/types/tasks';
import { createTasks, getAllTasks } from '@/redux/feature/task/task-thunk';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

const { Option } = Select;

const AutoSaveTable = () => {
  const dispatch = useAppDispatch();
  const { tasksValue, loading: reduxLoading } = useAppSelector(
    (state) => state.task,
  );
  const params = useParams();
  const projectId = params.projectId;

  // Local state
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
    title: string;
    assignees: User[];
    status: string;
    dueDate: string | null;
    priority: string;
  } | null>(null);

  const {
    isOpen: isTaskModalOpen,
    openModal: openTaskModal,
    closeModal: closeTaskModal,
  } = useModal(false);

  const taskFormRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
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

  // Fetch all tasks
  const getAllTask = async () => {
    try {
      await dispatch(getAllTasks({ projectId: projectId })).unwrap();
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      showMessage('error', 'Failed to load tasks');
    }
  };

  // Initial fetch - removed tasksValue.length from dependencies to prevent infinite loop
  useEffect(() => {
    if (projectId) {
      getAllTask();
    }
  }, [projectId]);

  // Update local tasks when Redux state changes
  useEffect(() => {
    if (tasksValue) {
      setTasks(tasksValue);
    }
  }, [dispatch, tasksValue]);

  // Show message notification
  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Auto-save handler with proper cleanup
  const handleAutoSave = (id: number | string, field: string, value: any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        console.log(`Auto-saved Task ID: ${id} | ${field}: ${value}`);
        if (typeof id === 'number') {
          // await axios.patch(`/api/tasks/${id}`, { [field]: value });
          showMessage('success', 'Task auto-saved');
        }
      } catch (err) {
        console.error('Auto-save error:', err);
        showMessage('error', 'Failed to auto-save');
      }
    }, 600);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Update task recursively
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

  // Handle field change
  const handleChange = (id: number | string, field: string, value: any) => {
    const updated = updateTaskRecursively(tasks, id, field, value);
    setTasks(updated);
    handleAutoSave(id, field, value);
  };

  // Delete task recursively
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

  // Handle delete task
  const handleDeleteTask = (id: number | string) => {
    const updated = deleteTaskRecursively(tasks, id);
    setTasks(updated);
    showMessage('success', 'Task deleted successfully');
  };

  // Add subtask
  const handleAddSubtask = (parentId: number) => {
    setNewSubtask({
      parentId,
      title: '',
      assignees: [],
      status: 'NEW',
      dueDate: null,
      priority: 'MEDIUM',
    });

    setExpandedRows((prev) => new Set(prev).add(parentId));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Save subtask
  const handleSaveSubtask = async () => {
    if (!newSubtask?.title?.trim()) {
      showMessage('warning', 'Subtask title is required');
      return;
    }
    console.log('newSubtask', newSubtask);
    try {
      // Prepare API payload for subtask
      const subtaskPayload = {
        title: newSubtask.title,
        description: '', // Add description field if needed
        priority: newSubtask.priority,
        parentTaskId: String(newSubtask.parentId),
        // parentTaskId: newSubtask.parentId, // This is the key - links to parent task
        dueDate: newSubtask.dueDate,
        assigneeId: '9abde8d3-a4b5-4e47-9af8-1f2bfce8393f', // Or get from selected assignees
        projectId: projectId as string,
      };

      // Call API to create subtask
      await dispatch(createTasks(subtaskPayload)).unwrap();

      // Refresh tasks to get updated data from server
      await getAllTask();

      // Reset form
      setNewSubtask(null);
      setOpenDropdown(null);
    } catch (error) {
      console.error('Failed to create subtask:', error);
      showMessage('error', error?.message || 'Failed to create subtask');
    }

    const addSubtaskRecursively = (list: Task[]): Task[] =>
      list.map((task) => {
        if (task.id === newSubtask.parentId) {
          const newSub: Task = {
            id: Date.now(),
            title: newSubtask.title,
            assignees: newSubtask.assignees,
            status: newSubtask.status,
            dueDate: newSubtask.dueDate,
            priority: newSubtask.priority,
            subtasks: [],
          };

          return { ...task, subtasks: [...(task.subtasks || []), newSub] };
        }
        if (task.subtasks?.length) {
          return { ...task, subtasks: addSubtaskRecursively(task.subtasks) };
        }
        return task;
      });

    const updated = addSubtaskRecursively(tasks);
    console.log('updated', updated);

    setTasks(updated);
    showMessage('success', 'Subtask added');

    const currentParentId = newSubtask.parentId;
    setNewSubtask({
      parentId: currentParentId,
      title: '',
      assignees: [],
      status: 'NEW',
      dueDate: null,
      priority: 'Medium',
    });

    setOpenDropdown(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Cancel subtask
  const handleCancelSubtask = () => {
    setNewSubtask(null);
    setOpenDropdown(null);
  };

  // Handle click outside for new subtask
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        newSubtask &&
        !(e.target as HTMLElement).closest('.new-subtask-row') &&
        !(e.target as HTMLElement).closest('.ant-picker-dropdown') &&
        !(e.target as HTMLElement).closest('.ant-select-dropdown')
      ) {
        setNewSubtask(null);
      }
    };

    if (newSubtask) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [newSubtask]);

  // Handle click outside for dropdown
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

  // Toggle expand/collapse
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

  // Close task modal
  const handleCloseTaskModal = () => {
    closeTaskModal();
    taskFormRef.current?.resetForm?.();
  };

  // Handle task submit
  const handleTaskSubmit = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        priority: values.priority,
        parentTaskId: null,
        dueDate: values.dueDate,
        assigneeId: '9abde8d3-a4b5-4e47-9af8-1f2bfce8393f',
        // assigneeId: values.assignees.map((u: User) => u.id),
        // status: values.status,
        projectId: projectId as string,
      };
      dispatch(createTasks(payload));
      toast.success('Task created successfully!');
      handleCloseTaskModal();
      getAllTask(); // Refresh tasks
    } catch (error: any) {
      console.error('Task creation failed:', error);
      showMessage('error', error?.message || 'Failed to create task');
    }
  };

  // Render task row
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
              onMouseEnter={() => setHoveredTaskId(task.id as number)}
              onMouseLeave={() => setHoveredTaskId(null)}
            >
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

              <div className="relative flex-1">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) =>
                    handleChange(task.id, 'title', e.target.value)
                  }
                  className="w-full px-2 py-1 rounded border-transparent hover:border hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-all"
                  style={{ minWidth: '200px' }}
                />
              </div>

              {isHovered && (
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

                {task.assignees && task.assignees.length > 5 && (
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                    +{task.assignees.length - 5}
                  </div>
                )}

                {(!task.assignees || task.assignees.length === 0) && (
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
                          ? task.assignees?.filter((u) => u.id !== user.id) ||
                            []
                          : [...(task.assignees || []), user];
                        handleChange(task.id, 'assignees', updatedAssignees);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          task.assignees?.some((u) => u.id === user.id) || false
                        }
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

          <td className="py-2">
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

          <td className="p-3 py-2">
            <DatePicker
              value={task.dueDate ? dayjs(task.dueDate) : null}
              onChange={(date, dateString) =>
                handleChange(task.id, 'dueDate', dateString || null)
              }
              format="YYYY-MM-DD"
              className="w-full px-2 py-1 rounded"
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
              onClick={(e) => e.stopPropagation()}
            />
          </td>

          <td className="py-2 max-w-[100px]">
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
                <td
                  className="p-3 py-2"
                  style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter subtask title"
                    value={newSubtask.title}
                    onChange={(e) =>
                      setNewSubtask((s) =>
                        s ? { ...s, title: e.target.value } : s,
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); // optional — stops form submission or blur
                        handleSaveSubtask();
                      }
                    }}
                    className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

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

                      {newSubtask.assignees &&
                        newSubtask.assignees.length > 5 && (
                          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                            +{newSubtask.assignees.length - 5}
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
                                  ) || []
                                : [...(newSubtask.assignees || []), user];
                              setNewSubtask((s) =>
                                s ? { ...s, assignees: updatedAssignees } : s,
                              );
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={
                                newSubtask.assignees?.some(
                                  (u) => u.id === user.id,
                                ) || false
                              }
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

                <td className="py-2">
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

                <td className="p-3 py-2">
                  <DatePicker
                    value={
                      newSubtask?.dueDate ? dayjs(newSubtask.dueDate) : null
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

      <div className="flex items-center justify-end mb-3">
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
                  <th className="p-2 text-left font-semibold text-gray-700 max-w-[120px]">
                    Priority
                  </th>
                  <th className="p-2 text-left font-semibold text-gray-700 max-w-[80px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {reduxLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500">
                      Loading tasks...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-500">
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
