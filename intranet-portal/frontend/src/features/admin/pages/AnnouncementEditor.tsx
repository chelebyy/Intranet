
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useForm, useFieldArray, useController, type Control } from 'react-hook-form';
import { Combobox } from '../../../components/ui/combobox';
import { announcementApi, type CreateAnnouncementDto } from '../../../api/announcementApi';
import { birimsApi } from '../../../api/birimsApi';
import { rolesApi } from '../../../api/rolesApi';
import { usersApi } from '../../../api/usersApi';
import type { Birim } from '../../../types/api/birims';
import type { Role } from '../../../types/api/roles';
import type { UserDto } from '../../../types/api/users';
import toast from 'react-hot-toast';

// Simple types for dropdown options
const TARGET_TYPES = [
  { value: 'All', label: 'Tüm Kullanıcılar' },
  { value: 'Role', label: 'Belirli Rol' },
  { value: 'Unit', label: 'Belirli Birim' },
  { value: 'User', label: 'Belirli Kullanıcı (Sicil)' }
];

const ANNOUNCEMENT_TYPES = [
  { value: 'Info', label: 'Bilgilendirme (Mavi)' },
  { value: 'Warning', label: 'Uyarı (Sarı)' },
  { value: 'Critical', label: 'Kritik (Kırmızı)' }
];

const DISPLAY_TYPES = [
  { value: 'Banner', label: 'Banner (Sayfa Üstü)' },
  { value: 'Modal', label: 'Modal (Pop-up)' },
  { value: 'Widget', label: 'Dashboard Widget' }
];

export default function AnnouncementEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference data
  const [units, setUnits] = useState<Birim[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);

  const { register, control, handleSubmit, setValue, formState: { errors } } = useForm<CreateAnnouncementDto>({
    defaultValues: {
      type: 'Info',
      displayType: 'Widget',
      priority: 0,
      targets: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +7 days
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "targets"
  });

  useEffect(() => {
    fetchReferenceData();
    if (isEditMode) {
      loadAnnouncement();
    }
  }, [isEditMode]);

  const fetchReferenceData = async () => {
    try {
      const [unitsData, rolesData, usersData] = await Promise.all([
        birimsApi.getAll(),
        rolesApi.getAll(),
        usersApi.getAll()
      ]);
      setUnits(unitsData);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (err) {
      console.error('Reference data load error', err);
      toast.error('Birim ve Rol listeleri yüklenemedi');
    }
  };

  const loadAnnouncement = async () => {
    try {
      setIsLoading(true);
      const response = await announcementApi.getById(Number(id));
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setValue('title', data.title);
        setValue('content', data.content);
        setValue('type', data.type);
        setValue('displayType', data.displayType);
        setValue('startDate', data.startDate.split('T')[0]);
        setValue('endDate', data.endDate.split('T')[0]);
        setValue('priority', data.priority);
        setValue('targets', data.targets.map(t => ({
          targetType: t.targetType,
          targetValue: t.targetValue
        })));
      }
    } catch (error) {
      console.error('Load error', error);
      toast.error('Duyuru yüklenemedi');
      navigate('/admin/announcements');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateAnnouncementDto) => {
    try {
      setIsLoading(true);
      // Ensure dates are full ISO strings if backend expects logic
      // But API DTO uses DateTime, string normally parses fine.
      
      const formattedData = {
        ...data,
        // Ensure values are numbers even if HTML select returns strings
        targets: data.targets.map(t => ({
          ...t,
          targetValue: Number(t.targetValue)
        }))
      };

      if (isEditMode) {
        await announcementApi.update(Number(id), formattedData);
        toast.success('Duyuru güncellendi');
      } else {
        await announcementApi.create(formattedData);
        toast.success('Duyuru oluşturuldu');
      }
      navigate('/admin/announcements');
    } catch (error) {
      console.error('Save error', error);
      toast.error('Kaydetme işlemi başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/announcements')}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Oluştur'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Başlık</label>
              <input
                {...register('title', { required: 'Başlık gereklidir' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Örn: Hafta Sonu Bakım Çalışması"
              />
              {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Öncelik (Sıra)</label>
              <input
                type="number"
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-xs text-gray-500">Yüksek sayı = Daha üstte gösterilir</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Duyuru Tipi</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {ANNOUNCEMENT_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gösterim Yeri</label>
              <select
                {...register('displayType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {DISPLAY_TYPES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Bitiş Tarihi</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">İçerik (HTML)</label>
            <textarea
              {...register('content', { required: 'İçerik gereklidir' })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="<p>Duyuru içeriği buraya...</p>"
            />
            {errors.content && <span className="text-xs text-red-500">{errors.content.message}</span>}
            <span className="text-xs text-gray-500 block">Basit HTML etiketleri kullanabilirsiniz (p, b, i, ul, li).</span>
          </div>
        </div>

        {/* Targeting Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-900">Hedef Kitle</h2>
            <button
              type="button"
              onClick={() => append({ targetType: 'All', targetValue: 0 })}
              className="flex items-center px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200"
            >
              <Plus className="w-3 h-3 mr-1" />
              Hedef Ekle
            </button>
          </div>

          <div className="space-y-3">
            {fields.length === 0 && (
              <p className="text-sm text-gray-500 italic">Hiçbir hedef seçilmedi. (Boş bırakılırsa kimse görmez, herkese göstermek için "Tüm Kullanıcılar" ekleyin)</p>
            )}
            
            {fields.map((field, index) => (
              <TargetRow 
                key={field.id} 
                index={index} 
                control={control} 
                remove={remove}
                units={units}
                roles={roles}
                users={users}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Sub-component to handle the conditional logic cleanly
const TargetRow = ({ index, control, remove, units, roles, users }: {
  index: number;
  control: Control<CreateAnnouncementDto>;

  remove: (index?: number | number[]) => void;
  units: Birim[];
  roles: Role[];
  users: UserDto[];
}) => {
  const { field: targetTypeField } = useController({
    control,
    name: `targets.${index}.targetType`,
    defaultValue: 'All'
  });

  const { field: targetValueField } = useController({
    control,
    name: `targets.${index}.targetValue`,
    defaultValue: 0
  });

  // Prepare options based on type
  const getOptions = () => {
    switch (targetTypeField.value) {
      case 'Unit':
        return units.map(u => ({ value: u.birimID, label: u.birimAdi }));
      case 'Role':
        return roles.map(r => ({ value: r.roleID, label: r.roleName }));
      case 'User':
        return users.map(u => ({ value: u.userID, label: `${u.ad} ${u.soyad} (${u.sicil})` }));
      default:
        return [];
    }
  };

  return (
    <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-md">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
        <select
          {...targetTypeField}
          onChange={(e) => {
            targetTypeField.onChange(e); // Update type
            targetValueField.onChange(0); // Reset value when type changes
          }}
          className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
        >
          {TARGET_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {targetTypeField.value === 'All' ? (
          <input
            disabled
            value="-"
            className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-400"
          />
        ) : (
          <Combobox
            options={getOptions()}
            value={targetValueField.value}
            onSelect={(val) => targetValueField.onChange(Number(val))}
            placeholder={
              targetTypeField.value === 'Unit' ? 'Birim Ara...' :
              targetTypeField.value === 'Role' ? 'Rol Ara...' :
              targetTypeField.value === 'User' ? 'Kullanıcı Ara...' : 'Seçiniz...'
            }
            searchPlaceholder="Aramak için yazın..."
            emptyText="Sonuç bulunamadı."
            className="w-full bg-white"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => remove(index)}
        className="p-1 text-red-500 hover:bg-red-50 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

