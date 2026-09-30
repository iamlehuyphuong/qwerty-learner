import { TypingContext, TypingStateActionType } from '../../store'
import AdvancedSetting from './AdvancedSetting'
import DataSetting from './DataSetting'
import SoundSetting from './SoundSetting'
import { Button } from '@/components/ui/button'
import ViewSetting from '@/pages/Typing/components/Setting/ViewSetting'
import { Dialog, Tab, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Settings, X } from 'lucide-react'
import { Fragment, useContext, useState } from 'react'
import IconEye from '~icons/heroicons/eye-solid'
import IconAdjustmentsHorizontal from '~icons/tabler/adjustments-horizontal'
import IconDatabaseCog from '~icons/tabler/database-cog'
import IconEar from '~icons/tabler/ear'

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch } = useContext(TypingContext) ?? {}

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    if (dispatch) {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={openModal}
        className="h-8 w-8 border-indigo-500 text-indigo-500 transition-colors"
        title="Mở hộp thoại cài đặt"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-[720px] flex-col rounded-2xl border border-gray-700 bg-white p-0 shadow-xl dark:bg-gray-900">
                  <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-gray-700">
                    <span className="text-2xl font-bold text-gray-600 dark:text-white">Cài đặt</span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      title="Đóng"
                      className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <Tab.Group vertical>
                    <div className="flex h-[480px] w-full overflow-hidden rounded-b-2xl">
                      <Tab.List className="flex h-full w-48 flex-col items-start space-y-2 border-r border-neutral-100 px-3 py-3 dark:border-gray-700">
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-12 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors focus:outline-none',
                              selected
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'text-neutral-500 hover:bg-gray-700/50 hover:text-white dark:text-white/70',
                            )
                          }
                        >
                          <IconEar className="mr-1 h-4 w-4" />
                          <span>Âm thanh</span>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-12 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors focus:outline-none',
                              selected
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'text-neutral-500 hover:bg-gray-700/50 hover:text-white dark:text-white/70',
                            )
                          }
                        >
                          <IconAdjustmentsHorizontal className="mr-1 h-4 w-4" />
                          <span>Nâng cao</span>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-12 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors focus:outline-none',
                              selected
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'text-neutral-500 hover:bg-gray-700/50 hover:text-white dark:text-white/70',
                            )
                          }
                        >
                          <IconEye className="mr-1 h-4 w-4" />
                          <span>Hiển thị</span>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-12 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors focus:outline-none',
                              selected
                                ? 'bg-indigo-500/20 text-indigo-400'
                                : 'text-neutral-500 hover:bg-gray-700/50 hover:text-white dark:text-white/70',
                            )
                          }
                        >
                          <IconDatabaseCog className="mr-1 h-4 w-4" />
                          <span>Dữ liệu</span>
                        </Tab>
                      </Tab.List>

                      <Tab.Panels className="h-full w-full flex-1">
                        <Tab.Panel className="flex h-full w-full focus:outline-none">
                          <SoundSetting />
                        </Tab.Panel>
                        <Tab.Panel className="flex h-full focus:outline-none">
                          <AdvancedSetting />
                        </Tab.Panel>
                        <Tab.Panel className="flex h-full focus:outline-none">
                          <ViewSetting />
                        </Tab.Panel>
                        <Tab.Panel className="flex h-full focus:outline-none">
                          <DataSetting />
                        </Tab.Panel>
                      </Tab.Panels>
                    </div>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
